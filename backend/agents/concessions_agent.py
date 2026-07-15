"""
Aligns with 'Smart Stadiums & Tournament Operations — Stadium operations optimization'.
This agent manages concession stands, food/drink inventory levels, wait times, and vendor POS resources.
"""

import json
import os
import sys
from typing import List, Optional

from anthropic import Anthropic

# Add parent directory to path to import models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from models import AgentOpinion, FanSignal, SignalCluster


def get_concessions_opinion(cluster: SignalCluster, signals: Optional[List[FanSignal]] = None) -> AgentOpinion:
    """Analyze a signal cluster from the perspective of concessions and food vendor operations.

    Args:
        cluster (SignalCluster): The signal cluster to analyze.
        signals (Optional[List[FanSignal]]): A list of all captured fan signals. Defaults to None.

    Returns:
        AgentOpinion: An opinion containing concessions recommendations, reasoning, and constraints.
    """
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Warning: ANTHROPIC_API_KEY not found. Returning a stub opinion.")
        return AgentOpinion(
            agent_name="ConcessionsAgent",
            cluster_id=cluster.id,
            recommendation="Deploy backup staff and monitor inventory levels in the zone.",
            reasoning="Unable to perform live LLM analysis due to missing API key.",
            constraints=["Adhere to standard stadium inventory allocation caps"],
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
You are the GenAI Concessions Operations Agent for the FIFA World Cup 2026 Stadium Operations center.
Your core responsibilities include:
- Optimizing stadium food, beverage, and merchandise vendor operations.
- Monitoring and managing inventory/stock levels (e.g. food, water, ice), restock supply routes, queue wait times, and vendor staffing resources.
- Ensuring transaction systems (e.g., POS terminal readers) are functional.

Review the following Signal Cluster:
- Cluster ID: {cluster.id}
- Zone/Location: {cluster.zone}
- Topic: {cluster.topic}
- Confidence Score: {cluster.confidence_score}

Underlying member signals:
{signals_context}

Provide your concessions assessment and action plan in a strict JSON format containing:
1. "recommendation": A clear, actionable directive for stadium concessions/ops staff.
2. "reasoning": The analytical support for this recommendation based on wait times, customer sentiments, resource levels, and business impact.
3. "constraints": A list of operational constraints or limitations to keep in mind (e.g. restock routes must avoid heavy pedestrian traffic flow, card reader issues require offline or cash backup options, staffing limits).

Respond ONLY with a valid JSON object matching the format below:
{{
  "recommendation": "Deploy mobile beverage units to Zone B and dispatch IT support to check POS terminals...",
  "reasoning": "Long lines are forming due to card reader failures combined with a rush for cold drinks...",
  "constraints": [
    "Restock delivery carts must not enter main corridors during high crowd movement times.",
    "Cash handling registers must be activated to process transactions offline.",
    "Staff reallocations must not deplete the main concession stand in Zone A."
  ]
}}
Do not include any chat formatting, markdown blocks (like ```json), or introductory/concluding text. Return raw JSON text only.
"""

    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=2000,
            system="You are a precise stadium concessions operations reasoning assistant that outputs only valid JSON.",
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
            agent_name="ConcessionsAgent",
            cluster_id=cluster.id,
            recommendation=opinion_data["recommendation"],
            reasoning=opinion_data["reasoning"],
            constraints=opinion_data.get("constraints", []),
        )
    except Exception as e:
        print(f"Error calling Concessions Agent API: {e}")
        return AgentOpinion(
            agent_name="ConcessionsAgent",
            cluster_id=cluster.id,
            recommendation="Inspect the concession stands in the zone.",
            reasoning=f"Agent analysis failed due to exception: {str(e)}",
            constraints=["Ensure vendors are informed of active queue status"],
        )
