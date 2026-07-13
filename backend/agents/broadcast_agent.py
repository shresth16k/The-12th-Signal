import os
import json
import sys
from typing import List, Optional
from anthropic import Anthropic

# Add parent directory to path to import models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from models import SignalCluster, FanSignal, AgentOpinion

def get_broadcast_opinion(cluster: SignalCluster, signals: Optional[List[FanSignal]] = None) -> AgentOpinion:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Warning: ANTHROPIC_API_KEY not found. Returning a stub opinion.")
        return AgentOpinion(
            agent_name="BroadcastAgent",
            cluster_id=cluster.id,
            recommendation="Monitor camera feeds in the zone and advise director of any visible disruptions.",
            reasoning="Unable to perform live LLM analysis due to missing API key.",
            constraints=["Avoid broadcasting negative stadium conditions on the main feed"]
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
You are the GenAI Broadcast Operations Agent for the FIFA World Cup 2026 Stadium Operations center.
Your core responsibilities include:
- Managing and optimizing the media broadcast feed, camera coverage, and on-screen messaging.
- Assessing whether incident clusters are broadcast-relevant (e.g. crowd atmosphere, fan celebrations, banner displays, camera angle line-of-sight obstruction risks, on-screen messaging or sponsor integration opportunities).

Review the following Signal Cluster:
- Cluster ID: {cluster.id}
- Zone/Location: {cluster.zone}
- Topic: {cluster.topic}
- Confidence Score: {cluster.confidence_score}

Underlying member signals:
{signals_context}

Provide your broadcast assessment and action plan in a strict JSON format containing:
1. "recommendation": A clear, actionable directive for stadium broadcast/media ops staff.
2. "reasoning": The analytical support for this recommendation based on visual quality, viewer engagement, camera path obstructions, and broadcast continuity.
3. "constraints": A list of operational constraints or limitations to keep in mind (e.g. FCC/FIFA broadcast regulations, avoiding showing negative/dangerous incidents on main feed, maintaining sponsor visibility, director review requirements).

Respond ONLY with a valid JSON object matching the format below:
{{
  "recommendation": "Instruct camera operator 4 in Zone B to pan away from the concessions queues and focus on the fan choreo...",
  "reasoning": "Large queues in Zone B are creating a bad visual backdrop for the corner camera angle. Redirecting focus to the fan banner display preserves positive broadcast aesthetics...",
  "constraints": [
    "Do not display empty seats or security interventions on the main program feed.",
    "Ensure on-screen graphics overlay does not block primary sponsor logos on the pitch perimeter boards.",
    "Broadcast director must approve any live feed camera cuts."
  ]
}}
Do not include any chat formatting, markdown blocks (like ```json), or introductory/concluding text. Return raw JSON text only.
"""

    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=2000,
            system="You are a precise stadium broadcast operations reasoning assistant that outputs only valid JSON.",
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
            agent_name="BroadcastAgent",
            cluster_id=cluster.id,
            recommendation=opinion_data["recommendation"],
            reasoning=opinion_data["reasoning"],
            constraints=opinion_data.get("constraints", [])
        )
    except Exception as e:
        print(f"Error calling Broadcast Agent API: {e}")
        return AgentOpinion(
            agent_name="BroadcastAgent",
            cluster_id=cluster.id,
            recommendation="Inspect camera placement and monitor local feed.",
            reasoning=f"Agent analysis failed due to exception: {str(e)}",
            constraints=["Notify broadcast control room of potential local visual obstructions"]
        )
