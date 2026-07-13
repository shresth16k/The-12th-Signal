import os
import sys
import json
from datetime import datetime, timezone

# Load environment variables if .env exists
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env')))
except ImportError:
    pass

# Add backend directory to path to import models and broadcast agent
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from models import SignalCluster, FanSignal
from agents.broadcast_agent import get_broadcast_opinion

def run_test():
    # Read signals.json to find signals
    signals_file = os.path.join(os.path.dirname(__file__), "signals.json")
    if not os.path.exists(signals_file):
        print(f"Error: Mock signals file not found at {signals_file}")
        print("Please run generate_signals.py first.")
        return

    with open(signals_file, "r") as f:
        raw_data = json.load(f)

    # Parse and filter for signals
    signals = []
    for d in raw_data:
        d_copy = d.copy()
        if "timestamp" in d_copy:
            d_copy["timestamp"] = datetime.fromisoformat(d_copy["timestamp"])
        sig = FanSignal(**d_copy)
        signals.append(sig)

    # Create a mock SignalCluster representing a potential visual disruption in Zone C (restroom flooding spilling into concourse)
    mock_cluster = SignalCluster(
        id="clus_test_broadcast",
        signal_ids=["sig_sample_broadcast_1", "sig_sample_broadcast_2"],
        zone="Zone C",
        topic="Water Spill in Concourse (Camera 4 Backdrop)",
        confidence_score=0.91,
        created_at=datetime.now(timezone.utc)
    )

    print(f"Testing Broadcast Agent on Cluster:")
    print(f" - ID:         {mock_cluster.id}")
    print(f" - Zone:       {mock_cluster.zone}")
    print(f" - Topic:      {mock_cluster.topic}")
    print(f" - Clustered Signals: {len(mock_cluster.signal_ids)}")

    # Check if API key is present
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("\n[WARNING] ANTHROPIC_API_KEY environment variable is not set.")
        print("Running in stub/fallback mode.")
        opinion = get_broadcast_opinion(mock_cluster, signals)
    else:
        print("\nInvoking live Claude 3.5 Sonnet assessment...")
        opinion = get_broadcast_opinion(mock_cluster, signals)

    print("\n" + "=" * 80)
    print("BROADCAST AGENT OPINION:")
    print("=" * 80)
    print(f"Agent Name:     {opinion.agent_name}")
    print(f"Cluster ID:     {opinion.cluster_id}")
    print(f"Recommendation: {opinion.recommendation}")
    print(f"Reasoning:\n{opinion.reasoning}")
    print("\nConstraints:")
    for constraint in opinion.constraints:
        print(f" - {constraint}")
    print("=" * 80)

if __name__ == "__main__":
    run_test()
