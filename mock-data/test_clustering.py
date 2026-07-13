import os
import sys
import json
from datetime import datetime

# Load environment variables if .env exists
try:
    from dotenv import load_dotenv
    # Look for .env in project root
    load_dotenv(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env')))
except ImportError:
    pass

# Add backend directory to path to import models and clustering logic
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from models import FanSignal
from clustering import cluster_signals

def run_test():
    # Read signals.json
    signals_file = os.path.join(os.path.dirname(__file__), "signals.json")
    if not os.path.exists(signals_file):
        print(f"Error: Mock signals file not found at {signals_file}")
        print("Please run generate_signals.py first.")
        return

    with open(signals_file, "r") as f:
        raw_data = json.load(f)
        
    print(f"Loaded {len(raw_data)} raw signals from mock data.")

    # Parse raw dictionaries into FanSignal objects
    signals = []
    for d in raw_data:
        # Convert timestamp string back to datetime
        d_copy = d.copy()
        if "timestamp" in d_copy:
            d_copy["timestamp"] = datetime.fromisoformat(d_copy["timestamp"])
        signals.append(FanSignal(**d_copy))

    # Check if API key is present
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("\n[WARNING] ANTHROPIC_API_KEY environment variable is not set.")
        print("Set your key to run the live Claude clustering API, e.g.:")
        print("  Windows (PowerShell): $env:ANTHROPIC_API_KEY='your-key'")
        print("  Linux/macOS: export ANTHROPIC_API_KEY='your-key'")
        print("\nDisplaying a sample of signals that would be sent to Claude:")
        # Print a few signals
        for s in signals[:5]:
            print(f" - {s.timestamp.strftime('%H:%M:%S')} [{s.location_zone}] ({s.source_type}): {s.raw_text} (Sentiment: {s.sentiment_score})")
        return

    print("\nRunning semantic clustering with Claude 3.5 Sonnet...")
    clusters = cluster_signals(signals)

    print(f"\nSuccessfully created {len(clusters)} clusters:")
    print("=" * 80)
    for i, c in enumerate(clusters, 1):
        print(f"Cluster {i}: ID={c.id}")
        print(f"  Topic:      {c.topic}")
        print(f"  Zone:       {c.zone}")
        print(f"  Confidence: {c.confidence_score}")
        print(f"  Signals:    {len(c.signal_ids)} clustered signals")
        
        # Display up to 3 signal text samples in this cluster
        print("  Samples:")
        samples_printed = 0
        for s_id in c.signal_ids:
            # Find the corresponding signal text
            sig = next((s for s in signals if s.id == s_id), None)
            if sig:
                print(f"    - {sig.raw_text}")
                samples_printed += 1
                if samples_printed >= 3:
                    break
        print("-" * 80)

if __name__ == "__main__":
    run_test()
