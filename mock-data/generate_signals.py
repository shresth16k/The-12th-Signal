import os
import sys
import json
import random
import uuid
from datetime import datetime, timedelta, timezone

# Add backend directory to path to import models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from models import FanSignal

def generate_mock_data():
    random.seed(42)  # For deterministic generation
    
    # Reference start time (match kickoff)
    start_time = datetime(2026, 7, 13, 18, 0, 0, tzinfo=timezone.utc)
    
    zones = [f"Zone {c}" for c in "ABCDEFGHIJ"]
    sources = ["voice", "app_tap", "AR", "social"]
    
    signals = []
    
    # Categories and templates
    templates = {
        "restroom": [
            "No toilet paper in the {zone} washroom.",
            "The hand dryer in {zone} is not working.",
            "Soap dispensers are completely empty in {zone}.",
            "Restroom lock is broken in {zone} stall 3.",
            "Water is leaking from the sink in {zone} restroom.",
            "Washroom in {zone} needs cleaning.",
        ],
        "concession": [
            "Concession stand line in {zone} is barely moving.",
            "Waited 20 minutes for a hot dog in {zone}.",
            "They ran out of cold drinks in {zone}.",
            "Card reader is failing at the food counter in {zone}.",
            "The queue at the beer counter in {zone} is blocking the aisle.",
            "Pretzel is stale at the stand in {zone}.",
        ],
        "medical": [
            "Someone slipped and fell near {zone}.",
            "Requesting assistance, fan feeling dizzy in section near {zone}.",
            "Need a first aid kit near the stairs in {zone}.",
            "A spectator in {zone} has a severe nosebleed.",
            "Is there a medical room close to {zone}?",
            "Paramedics needed in Section near {zone} for heat exhaustion.",
        ],
        "wayfinding": [
            "Where is the nearest exit from {zone}?",
            "How do I get to Gate 3 from {zone}?",
            "Where is section 112 from {zone}?",
            "Is there a lift or elevator near {zone}?",
            "Where are the baby changing facilities near {zone}?",
            "Which way to the merchandise store from {zone}?",
        ]
    }
    
    # 1. Generate 155 standard background signals across the 90-minute window
    for _ in range(155):
        category = random.choice(["restroom", "concession", "medical", "wayfinding"])
        zone = random.choice(zones)
        source = random.choice(sources)
        
        # Calculate random offset within 90 minutes
        offset_minutes = random.uniform(0, 90)
        timestamp = start_time + timedelta(minutes=offset_minutes)
        
        text_template = random.choice(templates[category])
        raw_text = text_template.format(zone=zone)
        
        # Sentiment score ranges
        if category in ["restroom", "concession"]:
            sentiment = random.uniform(-0.8, -0.2)
        elif category == "medical":
            sentiment = random.uniform(-0.9, -0.5)
        else: # wayfinding
            sentiment = random.uniform(-0.2, 0.2)
            
        signal = FanSignal(
            id=f"sig_{uuid.uuid4().hex[:8]}",
            timestamp=timestamp,
            source_type=source,
            location_zone=zone,
            raw_text=raw_text,
            sentiment_score=round(sentiment, 2)
        )
        signals.append(signal)
        
    # 2. Generate deliberate spike cluster: 45 signals in Zone C between minute 50 and 55
    spike_zone = "Zone C"
    spike_templates = [
        "Major flooding in the main restroom in {zone}!",
        "Water is overflowing from the toilets in {zone} washroom.",
        "Restroom in {zone} is flooded, water is leaking into the concourse.",
        "Avoid the {zone} toilets, there's a burst pipe and water is everywhere.",
        "Huge puddle outside the washrooms in {zone}, looks like a leak.",
        "Toilets backing up in {zone}, we need maintenance now.",
        "The floor is completely covered in water in {zone} restroom.",
        "Water leak near the toilets in Section C / {zone}."
    ]
    
    for _ in range(45):
        source = random.choice(sources)
        # Spike timeframe: 50 to 55 minutes into the match
        offset_minutes = random.uniform(50, 55)
        timestamp = start_time + timedelta(minutes=offset_minutes)
        
        text_template = random.choice(spike_templates)
        raw_text = text_template.format(zone=spike_zone)
        sentiment = random.uniform(-0.95, -0.7)
        
        signal = FanSignal(
            id=f"sig_spike_{uuid.uuid4().hex[:8]}",
            timestamp=timestamp,
            source_type=source,
            location_zone=spike_zone,
            raw_text=raw_text,
            sentiment_score=round(sentiment, 2)
        )
        signals.append(signal)
        
    # Sort signals by timestamp
    signals.sort(key=lambda s: s.timestamp)
    
    # Serialize to JSON
    signals_data = []
    for s in signals:
        dump = s.model_dump()
        # Convert datetime to ISO format string
        dump["timestamp"] = dump["timestamp"].isoformat()
        signals_data.append(dump)
        
    # Output path
    output_dir = os.path.dirname(__file__)
    output_path = os.path.join(output_dir, "signals.json")
    
    with open(output_path, "w") as f:
        json.dump(signals_data, f, indent=2)
        
    print(f"Generated {len(signals_data)} fan signals successfully.")
    print(f"Spike cluster of 45 signals generated in {spike_zone} between 50-55 mins.")
    print(f"Saved data to {output_path}")

if __name__ == "__main__":
    generate_mock_data()
