import os
import json
import sys
from datetime import datetime, timezone
from typing import List, Optional
from anthropic import Anthropic

# Add current directory to path to support imports if run from root/elsewhere
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from models import SignalCluster, FanSignal, AgentOpinion, Consensus
from agents.security_agent import get_security_opinion
from agents.concessions_agent import get_concessions_opinion
from agents.medical_agent import get_medical_opinion
from agents.transit_agent import get_transit_opinion
from agents.broadcast_agent import get_broadcast_opinion
from agents.rumor_agent import detect_rumor

def negotiate(cluster: SignalCluster, signals: Optional[List[FanSignal]] = None) -> Consensus:
    # 0. Check for rumors first and short-circuit if detected
    rumor_alert = detect_rumor(cluster, signals)
    if rumor_alert:
        return Consensus(
            cluster_id=cluster.id,
            final_action="push verified correction",
            contributing_opinions=[],
            timestamp=datetime.now(timezone.utc)
        )

    # 1. Gather all 5 opinions
    opinions = [
        get_security_opinion(cluster, signals),
        get_concessions_opinion(cluster, signals),
        get_medical_opinion(cluster, signals),
        get_transit_opinion(cluster, signals),
        get_broadcast_opinion(cluster, signals),
    ]

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Warning: ANTHROPIC_API_KEY not found. Returning a stub consensus.")
        # Join recommendations as a fallback
        final_action = "Fallback Consensus (API key missing): " + " | ".join([f"[{o.agent_name}]: {o.recommendation}" for o in opinions])
        return Consensus(
            cluster_id=cluster.id,
            final_action=final_action,
            contributing_opinions=opinions,
            timestamp=datetime.now(timezone.utc)
        )

    client = Anthropic(api_key=api_key)

    # Prepare opinions for the prompt
    opinions_data = []
    for o in opinions:
        opinions_data.append({
            "agent_name": o.agent_name,
            "recommendation": o.recommendation,
            "reasoning": o.reasoning,
            "constraints": o.constraints
        })

    prompt = f"""
You are the Chief Operations Coordinator for the FIFA World Cup 2026 Stadium Operations center.
Your job is to review the independent recommendations, reasoning, and constraints from 5 different GenAI department agents:
1. Security Agent (Safety, egress, crowd density)
2. Concessions Agent (Food/bev inventory, staffing, queue delays)
3. Medical Agent (First aid, paramedic access, bay capacity)
4. Transit Agent (Corridor bottlenecks, gate flow, transit connections)
5. Broadcast Agent (Media feeds, camera lines, viewer sentiment)

Review the following Signal Cluster details:
- Cluster ID: {cluster.id}
- Zone/Location: {cluster.zone}
- Topic: {cluster.topic}

And the contributing opinions from the agents:
{json.dumps(opinions_data, indent=2)}

Your task is to reconcile any conflicting recommendations, balance the constraints, and synthesize a single, unified final action plan. Safety and medical needs are always top priority, followed by flow/capacity constraints, vendor inventory adjustments, and media broadcast positioning.

Respond ONLY with a valid JSON object matching the format below:
{{
  "final_action": "A cohesive, step-by-step master plan resolving constraints (e.g. redirecting fans to alternate corridors, dispatching a medic via route B to avoid crowd bottleneck, instructing camera 4 to pan away from the queue while deploying mobile water carts in Zone C)..."
}}
Do not include any chat formatting, markdown blocks (like ```json), or introductory/concluding text. Return raw JSON text only.
"""

    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=2000,
            system="You are a precise Chief Operations Coordinator for a major stadium, synthesizing department opinions into a single action plan in JSON format.",
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

        consensus_data = json.loads(content)

        return Consensus(
            cluster_id=cluster.id,
            final_action=consensus_data["final_action"],
            contributing_opinions=opinions,
            timestamp=datetime.now(timezone.utc)
        )
    except Exception as e:
        print(f"Error during orchestrator negotiation: {e}")
        # Return fallback consensus
        final_action = "Fallback Consensus (Exception occurred): " + " | ".join([f"[{o.agent_name}]: {o.recommendation}" for o in opinions])
        return Consensus(
            cluster_id=cluster.id,
            final_action=final_action,
            contributing_opinions=opinions,
            timestamp=datetime.now(timezone.utc)
        )
