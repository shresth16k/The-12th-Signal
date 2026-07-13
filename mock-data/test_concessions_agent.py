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

# Add backend directory to path to import models and concessions agent
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from models import SignalCluster, FanSignal
from agents.concessions_agent import get_concessions_opinion

def run_test():
    # Read signals.json to find concession signals
    signals_file = os.path.join(os.path.dirname(__file__), "signals.json")
    if not os.path.exists(signals_file):
        print(f"Error: Mock signals file not found at {signals_file}")
        print("Please run generate_signals.py first.")
        return

    with open(signals_file, "r") as f:
        raw_data = json.load(f)

    # Parse and filter for concession-related signals in Zone B
    signals = []
    concession_sig_ids = []
    for d in raw_data:
        d_copy = d.copy()
        if "timestamp" in d_copy:
            d_copy["timestamp"] = datetime.fromisoformat(d_copy["timestamp"])
        sig = FanSignal(**d_copy)
        signals.append(sig)
        
        # Identify concession signals in Zone B
        if sig.location_zone == "Zone B" and any(word in sig.raw_text.lower() for word in ["line", "queue", "beer", "food", "hot dog", "wait", "stand"]):
            concession_sig_ids.append(sig.id)

    # Create a mock SignalCluster for the Zone B concessions issue
    mock_cluster = SignalCluster(
        id="clus_test_concessions",
        signal_ids=concession_sig_ids[:5] if concession_sig_ids else ["sig_sample_concessions"],
        zone="Zone B",
        topic="Concession Stand Queue Delay",
        confidence_score=0.92,
        created_at=datetime.now(timezone.utc)
    )

    print(f"Testing Concessions Agent on Cluster:")
    print(f" - ID:         {mock_cluster.id}")
    print(f" - Zone:       {mock_cluster.zone}")
    print(f" - Topic:      {mock_cluster.topic}")
    print(f" - Clustered Signals: {len(mock_cluster.signal_ids)}")

    # Check if API key is present
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("\n[WARNING] ANTHROPIC_API_KEY environment variable is not set.")
        print("Running in stub/fallback mode.")
        opinion = get_concessions_opinion(mock_cluster, signals)
    else:
        print("\nInvoking live Claude 3.5 Sonnet assessment...")
        opinion = get_concessions_opinion(mock_cluster, signals)

    print("\n" + "=" * 80)
    print("CONCESSIONS AGENT OPINION:")
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
