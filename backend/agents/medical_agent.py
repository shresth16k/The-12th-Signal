"""
Aligns with 'Smart Stadiums & Tournament Operations — Stadium operations optimization'.
This agent coordinates emergency medical responses, first-aid dispatch, and ambulance egress routes.
"""

import json
import os
import sys
from typing import List, Optional

from anthropic import Anthropic

# Add parent directory to path to import models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from models import AgentOpinion, FanSignal, SignalCluster


def get_medical_opinion(cluster: SignalCluster, signals: Optional[List[FanSignal]] = None) -> AgentOpinion:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Warning: ANTHROPIC_API_KEY not found. Returning a stub opinion.")
        return AgentOpinion(
            agent_name="MedicalAgent",
            cluster_id=cluster.id,
            recommendation="Dispatch local zone first-aiders to inspect and assist immediately.",
            reasoning="Unable to perform live LLM analysis due to missing API key.",
            constraints=["Ensure local first-aid equipment is stocked and ready"],
        )

    client = Anthropic(api_key=api_key)

    # Filter signals belonging to this cluster
    member_signals_text = []
    if signals:
        for s_id in cluster.signal_ids:
            sig = next((s for s in signals if s.id == s_id), None)
            if sig:
                member_signals_text.append(f"- [{sig.timestamp}] {sig.raw_text} (Sentiment: {sig.sentiment_score})")

    signals_context = "\n".join(member_signals_text) if member_signals_text else "No detailed signal logs provided."

    prompt = f"""
You are the GenAI Medical Operations Agent for the FIFA World Cup 2026 Stadium Operations center.
Your core responsibilities include:
- Safeguarding fan health and coordinate emergency medical responses.
- Monitoring and managing health/safety risks (e.g. heat exhaustion, physical injuries, cardiac incidents), assessing proximity to stadium medical stations/bays, and planning emergency ambulance egress/ingress routes.

Review the following Signal Cluster:
- Cluster ID: {cluster.id}
- Zone/Location: {cluster.zone}
- Topic: {cluster.topic}
- Confidence Score: {cluster.confidence_score}

Underlying member signals:
{signals_context}

Provide your medical assessment and action plan in a strict JSON format containing:
1. "recommendation": A clear, actionable directive for stadium medical/ops staff.
2. "reasoning": The analytical support for this recommendation based on the severity of the symptoms reported, heat index/temperature levels, and spatial layouts of the medical bays relative to the incident location.
3. "constraints": A list of operational constraints or limitations to keep in mind (e.g. ambulance entry routes must be cleared of crowd traffic, dispatch priority rules, medical station capacity limits, coordination with local hospitals).

Respond ONLY with a valid JSON object matching the format below:
{{
  "recommendation": "Dispatch a rapid response bike team with defibrillator and cooling packs to Zone H...",
  "reasoning": "Multiple reports of heat exhaustion are concentrated in Section 102/Zone H, which is furthest from Medical Bay 3...",
  "constraints": [
    "Ambulance access lane B must remain clear of stadium concessions queues.",
    "First responders must use quiet signaling to prevent crowd panic.",
    "Nearest medical bay is currently at 80% capacity."
  ]
}}
Do not include any chat formatting, markdown blocks (like ```json), or introductory/concluding text. Return raw JSON text only.
"""

    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=2000,
            system="You are a precise stadium medical operations reasoning assistant that outputs only valid JSON.",
            messages=[{"role": "user", "content": prompt}],
        )

        content = response.content[0].text.strip()
        if content.startswith("```"):
            lines = content.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines[-1].startswith("```"):
                lines = lines[:-1]
            content = "\n".join(lines).strip()

        opinion_data = json.loads(content)

        return AgentOpinion(
            agent_name="MedicalAgent",
            cluster_id=cluster.id,
            recommendation=opinion_data["recommendation"],
            reasoning=opinion_data["reasoning"],
            constraints=opinion_data.get("constraints", []),
        )
    except Exception as e:
        print(f"Error calling Medical Agent API: {e}")
        return AgentOpinion(
            agent_name="MedicalAgent",
            cluster_id=cluster.id,
            recommendation="Dispatch paramedics to perform check in the zone.",
            reasoning=f"Agent analysis failed due to exception: {str(e)}",
            constraints=["Ensure field medics have direct radio contact with stadium dispatch"],
        )
