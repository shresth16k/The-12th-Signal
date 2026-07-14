"""
Aligns with 'Smart Stadiums & Tournament Operations — Stadium operations optimization'.
This agent manages pedestrian corridor crowd flow, gate bottlenecks, egress logistics, and public transit schedules.
"""
import os
import json
import sys
from typing import List, Optional
from anthropic import Anthropic

# Add parent directory to path to import models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from models import SignalCluster, FanSignal, AgentOpinion

def get_transit_opinion(cluster: SignalCluster, signals: Optional[List[FanSignal]] = None) -> AgentOpinion:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Warning: ANTHROPIC_API_KEY not found. Returning a stub opinion.")
        return AgentOpinion(
            agent_name="TransitAgent",
            cluster_id=cluster.id,
            recommendation="Deploy local zone guides to distribute exiting crowds across alternative gates.",
            reasoning="Unable to perform live LLM analysis due to missing API key.",
            constraints=["Maintain safety clearances near municipal train and shuttle pickup areas"]
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
You are the GenAI Transit Operations Agent for the FIFA World Cup 2026 Stadium Operations center.
Your core responsibilities include:
- Managing fan egress/ingress transit logistics and crowd flow.
- Monitoring and managing corridor crowd capacity, gate flow bottlenecks, egress delays, and coordinating schedules with local public transit connections (e.g. buses, metro, trains).

Review the following Signal Cluster:
- Cluster ID: {cluster.id}
- Zone/Location: {cluster.zone}
- Topic: {cluster.topic}
- Confidence Score: {cluster.confidence_score}

Underlying member signals:
{signals_context}

Provide your transit assessment and action plan in a strict JSON format containing:
1. "recommendation": A clear, actionable directive for stadium transit/ops staff.
2. "reasoning": The analytical support for this recommendation based on egress flow rates, train/bus arrival intervals, gate blockages, and customer wait times.
3. "constraints": A list of operational constraints or limitations to keep in mind (e.g. gate capacities, train scheduling windows, municipal transit safety regulations, keeping cross-traffic flow areas clear).

Respond ONLY with a valid JSON object matching the format below:
{{
  "recommendation": "Extend gate 5 opening times and request municipal transit to increase bus dispatch frequency...",
  "reasoning": "Large crowds are bottling up near Zone A / Gate 5 waiting for shuttle connections which are running behind schedule...",
  "constraints": [
    "Metro connection timing cannot be delayed past match-day curfew.",
    "Corridor flow must not exceed 80 persons per minute for safety.",
    "Do not divert fans to gates that are currently undergoing security sweeps."
  ]
}}
Do not include any chat formatting, markdown blocks (like ```json), or introductory/concluding text. Return raw JSON text only.
"""

    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=2000,
            system="You are a precise stadium transit operations reasoning assistant that outputs only valid JSON.",
            messages=[
                {"role": "user", "content": prompt}
            ]
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
            agent_name="TransitAgent",
            cluster_id=cluster.id,
            recommendation=opinion_data["recommendation"],
            reasoning=opinion_data["reasoning"],
            constraints=opinion_data.get("constraints", [])
        )
    except Exception as e:
        print(f"Error calling Transit Agent API: {e}")
        return AgentOpinion(
            agent_name="TransitAgent",
            cluster_id=cluster.id,
            recommendation="Inspect transit channels in the zone.",
            reasoning=f"Agent analysis failed due to exception: {str(e)}",
            constraints=["Coordinate with external municipal transit control room"]
        )
