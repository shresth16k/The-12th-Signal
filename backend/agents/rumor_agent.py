import os
import json
import sys
from typing import List, Optional
from pydantic import BaseModel, Field
from anthropic import Anthropic

# Add parent directory to path to import models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from models import SignalCluster, FanSignal

class RumorAlert(BaseModel):
    cluster_id: str = Field(..., description="ID of the cluster evaluated")
    suspected_claim: str = Field(..., description="The unverified rumor or panic claim")
    suggested_correction: str = Field(..., description="The factual correction to display on stadium screens/app to calm fans")

def detect_rumor(cluster: SignalCluster, signals: Optional[List[FanSignal]] = None) -> Optional[RumorAlert]:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        # If API key is not present, we perform a simple local regex fallback 
        # to see if panic keywords are present and return a mock alert if so.
        has_panic = False
        panic_keywords = ["fire", "bomb", "shoot", "attack", "gun", "terror", "evacuate", "evacuation", "stampede", "hostage"]
        claim_keywords = []
        if signals:
            for s_id in cluster.signal_ids:
                sig = next((s for s in signals if s.id == s_id), None)
                if sig:
                    text = sig.raw_text.lower()
                    for kw in panic_keywords:
                        if kw in text:
                            has_panic = True
                            claim_keywords.append(kw)
        
        if has_panic:
            return RumorAlert(
                cluster_id=cluster.id,
                suspected_claim=f"Unverified reports mentioning safety threat ({', '.join(set(claim_keywords))}) in {cluster.zone}.",
                suggested_correction=f"Factual Correction: Stadium security has verified that there is no active hazard in {cluster.zone}. Please follow official instructions and remain calm."
            )
        return None

    # Filter signals belonging to this cluster
    member_signals_text = []
    has_panic_keywords = False
    panic_keywords = ["fire", "bomb", "shoot", "attack", "gun", "terror", "evacuate", "evacuation", "stampede", "hostage"]
    
    if signals:
        for s_id in cluster.signal_ids:
            sig = next((s for s in signals if s.id == s_id), None)
            if sig:
                text = sig.raw_text.lower()
                member_signals_text.append(f"- {sig.raw_text}")
                if any(kw in text for kw in panic_keywords):
                    has_panic_keywords = True

    # Fast-check optimization: if no signals have panic keywords, skip the LLM call entirely
    if not has_panic_keywords:
        return None

    client = Anthropic(api_key=api_key)
    signals_context = "\n".join(member_signals_text)

    prompt = f"""
You are the GenAI Rumor Dampener Agent for the FIFA World Cup 2026 Stadium Operations center.
Your job is to analyze fan signals in a cluster to detect potential false rumors, exaggerated panic claims, or misinformation (e.g. claims of "stadium fire", "bomb threat", "active shooter", "emergency evacuation") that can cause dangerous crowd stampedes or mass panic.

Review the following Signal Cluster details:
- Cluster ID: {cluster.id}
- Zone/Location: {cluster.zone}
- Topic: {cluster.topic}

Underlying member signals:
{signals_context}

Determine if this cluster represents an unverified rumor or exaggerated panic claim.
If YES:
1. Identify the "suspected_claim" (e.g. "Speculation of a bomb threat in Zone B").
2. Formulate a "suggested_correction" to calm the crowd and correct the narrative (e.g. "A loud noise in Zone B was caused by a popped balloon. There is no threat; please remain seated.").

If NO (i.e. the signals are about standard operational issues like restrooms, concession lines, normal wayfinding, or minor medical requests that do not involve mass panic rumors):
Return null.

Respond ONLY with either a valid JSON object matching the format below, or the word 'null' if no rumor is detected:
{{
  "suspected_claim": "Rumor of an active shooter near Gate 3...",
  "suggested_correction": "Factual Correction: Security has confirmed there is no security threat. A metal barrier fell over causing a loud noise. Gate 3 remains open."
}}
Do not include any chat formatting, markdown blocks (like ```json), or introductory/concluding text. Return raw JSON text or 'null' only.
"""

    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=1000,
            system="You are a precise rumor detection assistant. Output valid JSON or 'null' only.",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        content = response.content[0].text.strip()
        if content == "null" or content.lower() == "null" or not content:
            return None

        if content.startswith("```"):
            lines = content.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines[-1].startswith("```"):
                lines = lines[:-1]
            content = "\n".join(lines).strip()

        if content == "null" or content.lower() == "null" or not content:
            return None

        alert_data = json.loads(content)
        return RumorAlert(
            cluster_id=cluster.id,
            suspected_claim=alert_data["suspected_claim"],
            suggested_correction=alert_data["suggested_correction"]
        )
    except Exception as e:
        print(f"Error during rumor detection: {e}")
        return None
