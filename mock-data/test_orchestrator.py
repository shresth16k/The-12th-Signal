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

# Add backend directory to path to import models and orchestrator
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from models import SignalCluster, FanSignal
from orchestrator import negotiate

def run_test():
    # Read signals.json
    signals_file = os.path.join(os.path.dirname(__file__), "signals.json")
    if not os.path.exists(signals_file):
        print(f"Error: Mock signals file not found at {signals_file}")
        print("Please run generate_signals.py first.")
        return

    with open(signals_file, "r") as f:
        raw_data = json.load(f)

    # Parse signals
    signals = []
    spike_sig_ids = []
    for d in raw_data:
        d_copy = d.copy()
        if "timestamp" in d_copy:
            d_copy["timestamp"] = datetime.fromisoformat(d_copy["timestamp"])
        sig = FanSignal(**d_copy)
        signals.append(sig)
        
        # Collect Zone C flooding spike signals
        if sig.location_zone == "Zone C" and any(word in sig.raw_text.lower() for word in ["flood", "leak", "water", "overflow"]):
            spike_sig_ids.append(sig.id)

    # Create mock cluster
    mock_cluster = SignalCluster(
        id="clus_test_orchestrator",
        signal_ids=spike_sig_ids[:10] if spike_sig_ids else ["sig_sample_spike"],
        zone="Zone C",
        topic="Major Restroom Flooding in Concourse",
        confidence_score=0.97,
        created_at=datetime.now(timezone.utc)
    )

    print(f"Testing Orchestrator Negotiation on Cluster:")
    print(f" - ID:         {mock_cluster.id}")
    print(f" - Zone:       {mock_cluster.zone}")
    print(f" - Topic:      {mock_cluster.topic}")
    print(f" - Clustered Signals: {len(mock_cluster.signal_ids)}")

    # Check if API key is present
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("\n[WARNING] ANTHROPIC_API_KEY environment variable is not set.")
        print("Running in stub/fallback mode.")
        consensus = negotiate(mock_cluster, signals)
    else:
        print("\nInvoking live Claude 3.5 Sonnet coordination...")
        consensus = negotiate(mock_cluster, signals)

    print("\n" + "=" * 80)
    print("CONSOLIDATED ORCHESTRATOR CONSENSUS:")
    print("=" * 80)
    print(f"Cluster ID:   {consensus.cluster_id}")
    print(f"Timestamp:    {consensus.timestamp}")
    print(f"Final Action Plan:\n{consensus.final_action}")
    print("\nContributing Opinions:")
    for o in consensus.contributing_opinions:
        print(f" - [{o.agent_name}]: Rec='{o.recommendation}'")
    print("=" * 80)

if __name__ == "__main__":
    run_test()
