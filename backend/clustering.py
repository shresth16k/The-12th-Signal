import json
import os
import uuid
from datetime import datetime, timezone
from typing import List

from anthropic import Anthropic

from models import FanSignal, SignalCluster


def cluster_signals(signals: List[FanSignal]) -> List[SignalCluster]:
    """Group fan signals into semantic clusters based on topic similarity, location zone, and time.

    Args:
        signals (List[FanSignal]): A list of all captured fan signals to cluster.

    Returns:
        List[SignalCluster]: A list of generated signal clusters, or an empty list if clustering fails or no signals.
    """
    if not signals:
        return []

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Warning: ANTHROPIC_API_KEY not found in environment. Returning empty clusters.")
        return []

    client = Anthropic(api_key=api_key)

    # Prepare the signals data for the prompt
    signals_data = []
    for s in signals:
        signals_data.append(
            {
                "id": s.id,
                "timestamp": s.timestamp.isoformat() if isinstance(s.timestamp, datetime) else s.timestamp,
                "zone": s.location_zone,
                "text": s.raw_text,
                "sentiment": s.sentiment_score,
            }
        )

    prompt = f"""
You are an AI stadium-operations clustering system for the FIFA World Cup 2026.
Your job is to semantically group the following fan signals into clusters based on:
1. Topic similarity (e.g., washroom water leak, food stand lines, medical assistance, wayfinding).
2. Location zone (signals in the same cluster must generally be in the same zone).
3. Time proximity (signals in the same cluster should be close in time, within a rolling window of ~5 minutes).

Only create a cluster if there are multiple signals (2 or more) that are clearly related and indicate a pattern or incident. Do not create clusters for single isolated messages (like a single wayfinding question in a zone), unless it is a high-priority incident (like a medical emergency).
Make sure to group the deliberate "spike" of similar signals (e.g., flooding in Zone C) into a single large cluster.

Signals to cluster:
{json.dumps(signals_data, indent=2)}

Respond ONLY with a JSON list of clusters in the following format:
[
  {{
    "signal_ids": ["sig_id1", "sig_id2", ...],
    "zone": "Zone Name",
    "topic": "Brief descriptive topic name (e.g. Washroom Flooding, Concession Card Reader Outage)",
    "confidence_score": 0.95
  }}
]
Do not include any chat formatting, markdown blocks (like ```json), or introductory/concluding text. Return raw JSON text only.
"""

    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=4000,
            system="You are a precise data processing assistant that outputs only valid JSON arrays.",
            messages=[{"role": "user", "content": prompt}],
        )

        # Clean response content (strip markdown if Claude accidentally wrapped it)
        content = response.content[0].text.strip()
        if content.startswith("```"):
            lines = content.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines[-1].startswith("```"):
                lines = lines[:-1]
            content = "\n".join(lines).strip()

        clusters_raw = json.loads(content)

        clusters = []
        for c in clusters_raw:
            clusters.append(
                SignalCluster(
                    id=f"clus_{uuid.uuid4().hex[:8]}",
                    signal_ids=c["signal_ids"],
                    zone=c["zone"],
                    topic=c["topic"],
                    confidence_score=float(c.get("confidence_score", 1.0)),
                    created_at=datetime.now(timezone.utc),
                )
            )
        return clusters
    except Exception as e:
        print(f"Error during signal clustering: {e}")
        return []
