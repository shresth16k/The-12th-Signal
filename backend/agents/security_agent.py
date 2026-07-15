"""
Aligns with 'Smart Stadiums & Tournament Operations — Stadium operations optimization'.
This agent evaluates security threats, crowd routing hazards, and physical safety risks.
"""

import json
import os
import sys
from typing import List, Optional

from anthropic import Anthropic

# Add parent directory to path to import models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from models import AgentOpinion, FanSignal, SignalCluster


def get_security_opinion(cluster: SignalCluster, signals: Optional[List[FanSignal]] = None) -> AgentOpinion:
    """Analyze a signal cluster from the perspective of stadium security and crowd control.

    Args:
        cluster (SignalCluster): The signal cluster to analyze.
        signals (Optional[List[FanSignal]]): A list of all captured fan signals. Defaults to None.

    Returns:
        AgentOpinion: An opinion containing security recommendations, reasoning, and constraints.
    """
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Warning: ANTHROPIC_API_KEY not found. Returning a stub opinion.")
        return AgentOpinion(
            agent_name="SecurityAgent",
            cluster_id=cluster.id,
            recommendation="Dispatch local zone marshals to inspect the area immediately.",
            reasoning="Unable to perform live LLM analysis due to missing API key.",
            constraints=["Verify that radio communications are active and clear in the zone"],
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
You are the GenAI Security Operations Agent for the FIFA World Cup 2026 Stadium Operations center.
Your core responsibilities include:
- Safeguarding fan security and stadium crowd control.
- Identifying and mitigating crowd density risks, queue bottleneck congestion, evacuation route blockages, and gate access issues.
- Minimizing physical risks, hazards, and infrastructure failures that compromise safety.

Review the following Signal Cluster:
- Cluster ID: {cluster.id}
- Zone/Location: {cluster.zone}
- Topic: {cluster.topic}
- Confidence Score: {cluster.confidence_score}

Underlying member signals:
{signals_context}

Provide your security assessment and action plan in a strict JSON format containing:
1. "recommendation": A clear, actionable directive for stadium security/ops staff.
2. "reasoning": The analytical support for this recommendation based on the severity of the issue, crowd behavior, and spatial layout of the zone.
3. "constraints": A list of operational constraints or limitations to keep in mind (e.g. avoiding panic, maintaining evacuation route access, coordination with local police or medical).

Respond ONLY with a valid JSON object matching the format below:
{{
  "recommendation": "Deploy security officers to redirect pedestrian flow in Zone C...",
  "reasoning": "The flooding in the Zone C restrooms is forcing fans to crowd into the main egress corridor...",
  "constraints": [
    "Evacuation route gate 4 must remain unlocked and unobstructed.",
    "Do not block flow to neighboring Zone B corridors.",
    "Ops staff must use crowd control barriers rather than physical locks to redirect flow."
  ]
}}
Do not include any chat formatting, markdown blocks (like ```json), or introductory/concluding text. Return raw JSON text only.
"""

    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=2000,
            system="You are a precise stadium security operations reasoning assistant that outputs only valid JSON.",
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
            agent_name="SecurityAgent",
            cluster_id=cluster.id,
            recommendation=opinion_data["recommendation"],
            reasoning=opinion_data["reasoning"],
            constraints=opinion_data.get("constraints", []),
        )
    except Exception as e:
        print(f"Error calling Security Agent API: {e}")
        return AgentOpinion(
            agent_name="SecurityAgent",
            cluster_id=cluster.id,
            recommendation="Inspect the zone and monitor crowd density.",
            reasoning=f"Agent analysis failed due to exception: {str(e)}",
            constraints=["Maintain contact with lead stadium commander"],
        )
