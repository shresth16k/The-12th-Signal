import os
import sys
from datetime import datetime, timezone

# Add backend directory to path to import models and rumor agent
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from models import SignalCluster, FanSignal
from agents.rumor_agent import detect_rumor

# Load environment variables if .env exists
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env')))
except ImportError:
    pass

def run_test():
    # Scenario 1: Standard non-panic cluster (restroom leak)
    standard_signals = [
        FanSignal(id="sig_std_1", timestamp=datetime.now(timezone.utc), source_type="app_tap", location_zone="Zone C", raw_text="Water is leaking from the sink in restroom C", sentiment_score=-0.4),
        FanSignal(id="sig_std_2", timestamp=datetime.now(timezone.utc), source_type="social", location_zone="Zone C", raw_text="Bathroom C floor is completely wet", sentiment_score=-0.5),
    ]
    standard_cluster = SignalCluster(
        id="clus_std",
        signal_ids=["sig_std_1", "sig_std_2"],
        zone="Zone C",
        topic="Sink Leak in Restroom",
        confidence_score=0.95,
        created_at=datetime.now(timezone.utc)
    )

    # Scenario 2: Panic/Rumor cluster
    panic_signals = [
        FanSignal(id="sig_panic_1", timestamp=datetime.now(timezone.utc), source_type="social", location_zone="Zone B", raw_text="OMG there is a bomb near the entrance! Everyone run!", sentiment_score=-0.9),
        FanSignal(id="sig_panic_2", timestamp=datetime.now(timezone.utc), source_type="voice", location_zone="Zone B", raw_text="I heard people screaming about a shooter or attack near Zone B entrance!", sentiment_score=-0.8),
    ]
    panic_cluster = SignalCluster(
        id="clus_panic",
        signal_ids=["sig_panic_1", "sig_panic_2"],
        zone="Zone B",
        topic="Reports of Safety Hazard at Entrance",
        confidence_score=0.90,
        created_at=datetime.now(timezone.utc)
    )

    print("=== TESTING SCENARIO 1: Standard Restroom Incident (Non-Rumor) ===")
    alert_1 = detect_rumor(standard_cluster, standard_signals)
    print(f"Result (Expected: None): {alert_1}")

    print("\n=== TESTING SCENARIO 2: Panic Rumor Incident (Active Rumor) ===")
    alert_2 = detect_rumor(panic_cluster, panic_signals)
    if alert_2:
        print(f"Suspected Claim:      {alert_2.suspected_claim}")
        print(f"Suggested Correction: {alert_2.suggested_correction}")
    else:
        print("Result: None (no rumor detected)")

if __name__ == "__main__":
    run_test()
