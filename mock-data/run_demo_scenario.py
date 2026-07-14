#!/usr/bin/env python
import os
import sys
import json
import time
import argparse
import urllib.request
import urllib.error
from datetime import datetime, timezone

# --- UTF-8 Output Configuration ---
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# --- ANSI Terminal Color Setup (Windows Compatibility) ---
class Color:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def init_ansi():
    """Enable ANSI virtual terminal processing on Windows."""
    if sys.platform == 'win32':
        try:
            import ctypes
            kernel32 = ctypes.windll.kernel32
            # STD_OUTPUT_HANDLE is -11
            h_stdout = kernel32.GetStdHandle(-11)
            mode = ctypes.c_ulong()
            if kernel32.GetConsoleMode(h_stdout, ctypes.byref(mode)):
                # ENABLE_VIRTUAL_TERMINAL_PROCESSING is 0x0004
                # ENABLE_PROCESSED_OUTPUT is 0x0001
                # ENABLE_WRAP_AT_EOL_OUTPUT is 0x0002
                kernel32.SetConsoleMode(h_stdout, mode.value | 0x0004 | 0x0001 | 0x0002)
        except Exception:
            pass

# --- HTTP Helper Functions ---
def check_backend_running(url):
    """Check if the backend is reachable."""
    try:
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, timeout=2) as response:
            return response.status == 200
    except Exception:
        return False

def post_json(url, data):
    """Post JSON payload to the specified URL."""
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=10) as response:
        return json.loads(response.read().decode("utf-8"))

def get_json(url):
    """Get JSON from the specified URL."""
    req = urllib.request.Request(url, method="GET")
    with urllib.request.urlopen(req, timeout=15) as response:
        return json.loads(response.read().decode("utf-8"))

# --- Pretty Log Formatting ---
def format_signal_log(sig, is_spike):
    timestamp_str = ""
    if "timestamp" in sig:
        try:
            dt = datetime.fromisoformat(sig["timestamp"])
            timestamp_str = dt.strftime("%H:%M:%S")
        except Exception:
            timestamp_str = sig["timestamp"]
            
    source_icons = {
        "voice": "🎙️",
        "app_tap": "📱",
        "AR": "🕶️",
        "social": "💬"
    }
    icon = source_icons.get(sig["source_type"], "📣")
    
    sentiment = sig["sentiment_score"]
    if sentiment < -0.7:
        sent_color = Color.FAIL
    elif sentiment < -0.2:
        sent_color = Color.WARNING
    elif sentiment > 0.2:
        sent_color = Color.GREEN
    else:
        sent_color = Color.CYAN
        
    text = sig.get("raw_text", "")
    zone = sig.get("location_zone", "Unknown Zone")
    source = sig.get("source_type", "Unknown Source")
    
    if is_spike:
        return f"{Color.BOLD}{Color.FAIL}[🚨 SPIKE] [{timestamp_str}] {icon} {zone} | {source}: {text} (Sentiment: {sentiment}){Color.ENDC}"
    else:
        return f"{Color.BLUE}[{timestamp_str}]{Color.ENDC} {icon} {Color.BOLD}{zone}{Color.ENDC} | {source}: {text} (Sentiment: {sent_color}{sentiment}{Color.ENDC})"

def print_banner(text, color=Color.HEADER):
    width = 80
    print(f"\n{Color.BOLD}{color}┌" + "─" * (width - 2) + "┐")
    print(f"│ {text.center(width - 4)} │")
    print("└" + "─" * (width - 2) + "┘" + Color.ENDC)

# --- Mock Data for Simulation Mode ---
MOCK_CLUSTERS = [
    {
        "id": "clus_mock_spike_c",
        "zone": "Zone C",
        "topic": "Major Restroom Flooding and Water Leak",
        "confidence_score": 0.98,
        "signal_ids": ["mock_sig_1", "mock_sig_2", "mock_sig_3"]
    },
    {
        "id": "clus_mock_concession_g",
        "zone": "Zone G",
        "topic": "Concession Stand Cold Drink Shortage",
        "confidence_score": 0.88,
        "signal_ids": ["mock_sig_4", "mock_sig_5"]
    },
    {
        "id": "clus_mock_wayfinding_f",
        "zone": "Zone F",
        "topic": "Gate 3 Route Inquiries",
        "confidence_score": 0.82,
        "signal_ids": ["mock_sig_6", "mock_sig_7"]
    }
]

MOCK_CONSENSUS = {
    "cluster_id": "clus_mock_spike_c",
    "final_action": (
        "Chief Operations Coordinator Reconciled Master Plan:\n"
        "1. Safety & Infrastructure: Dispatch emergency plumbing crew to Zone C restrooms immediately to shut off the burst pipe. Deploy wet floor barriers.\n"
        "2. Security & Transit: Deploy security marshals to redirect pedestrian flow from Zone C corridor to Zone D. Update shuttle station signage to guide incoming fans to Gate D.\n"
        "3. Concessions & Medical: Suspend concession stand #3, secure POS equipment, and clear the area. Position a mobile first-aid team at Zone C corridor to monitor for slips and crowd distress.\n"
        "4. Broadcast & Media: Re-angle Camera 4 to focus on the upper stand, avoiding the flooded concourse floor. Elevate all floor cable runs in Zone C."
    ),
    "timestamp": datetime.now(timezone.utc).isoformat(),
    "contributing_opinions": [
        {
            "agent_name": "SecurityAgent",
            "recommendation": "Deploy security marshals to redirect pedestrian flow in Zone C main corridor.",
            "reasoning": "The flooding in the Zone C restrooms is forcing fans to crowd into the main egress corridor, creating a bottleneck and potential tripping hazard.",
            "constraints": ["Keep emergency exit Route 4 clear.", "Deploy wet floor warning signs.", "Avoid sudden blockages that could cause crowd panic."]
        },
        {
            "agent_name": "ConcessionsAgent",
            "recommendation": "Temporarily suspend concession stand #3 operations in Zone C and redirect staff to assist.",
            "reasoning": "Concession stand #3 is directly adjacent to the restroom leakage zone. Operations are impacted by standing water, and queue management is impossible.",
            "constraints": ["Secure cash registers and POS machines.", "Dispose of food exposed to water splash.", "Relocate perishable stock to Zone D storage."]
        },
        {
            "agent_name": "MedicalAgent",
            "recommendation": "Stand by medical response team at Zone C first aid station and prepare for slip-and-fall incidents.",
            "reasoning": "Flooding on the concourse floor significantly increases slip-and-fall hazards. High density of redirected crowd increases risk of minor crush injuries or heat exhaustion.",
            "constraints": ["Keep the ambulance access lane at Gate 3 entirely clear.", "Do not deploy heavy medical vehicles into the crowded corridor."]
        },
        {
            "agent_name": "TransitAgent",
            "recommendation": "Redirect incoming fans from the Zone C transit shuttle gates to Gate D corridor.",
            "reasoning": "Zone C concourse is saturated due to restroom flooding. Continuing to feed transit arrivals into Zone C will cause severe bottlenecks at the turnstiles.",
            "constraints": ["Update digital signage at shuttle platforms.", "Broadcast public transit announcements.", "Coordinate route adjustments with transport authority."]
        },
        {
            "agent_name": "BroadcastAgent",
            "recommendation": "Pan Camera 4 away from the restroom corridor and shift secondary broadcast feed to Zone A interview zone.",
            "reasoning": "Restroom flooding and standing water are visible in the backdrop of Camera 4, creating negative sentiment on social media feeds.",
            "constraints": ["Do not interrupt the primary match feed.", "Ensure cable channels in Zone C are elevated and waterproofed."]
        }
    ]
}

# --- Main Logic ---
def main():
    init_ansi()
    
    # Check for .env file to load Anthropic key if possible
    try:
        from dotenv import load_dotenv
        # Try parent dir (project root)
        load_dotenv(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env')))
        # Try backend dir
        load_dotenv(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend', '.env')))
    except ImportError:
        pass

    parser = argparse.ArgumentParser(description="Ingest signals.json and orchestrate 'The 12th Signal' demo scenario.")
    parser.add_argument("--url", default="http://127.0.0.1:8000", help="FastAPI backend base URL (default: http://127.0.0.1:8000)")
    parser.add_argument("--speedup", type=float, default=600.0, help="Simulation speedup factor (default: 600.0)")
    parser.add_argument("--max-sleep", type=float, default=0.2, help="Capped maximum delay in seconds between signal posts (default: 0.2)")
    parser.add_argument("--auto", action="store_true", help="Run automatically without pausing between phases")
    parser.add_argument("--simulate", action="store_true", help="Force complete simulation mode offline without contacting the backend")
    args = parser.parse_args()

    print_banner("THE 12TH SIGNAL - DEMO SCENARIO ORCHESTRATOR", Color.HEADER)
    print(f"Target Backend:      {Color.BOLD}{args.url}{Color.ENDC}")
    print(f"Speedup Factor:      {Color.BOLD}{args.speedup}x{Color.ENDC} (10 mins match time = {10*60/args.speedup:.2f}s real time)")
    print(f"Max Sleep Cap:       {Color.BOLD}{args.max_sleep}s{Color.ENDC}")
    print(f"Interaction Mode:    {Color.BOLD}{'Fully Automatic' if args.auto else 'Interactive (Press Enter to progress)'}{Color.ENDC}")

    # Determine paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    signals_file = os.path.join(script_dir, "signals.json")

    # Load signals.json
    if not os.path.exists(signals_file):
        print(f"\n{Color.BOLD}{Color.FAIL}[ERROR] signals.json not found at {signals_file}{Color.ENDC}")
        print("Please run mock-data/generate_signals.py first to seed the signals database.")
        sys.exit(1)

    with open(signals_file, "r") as f:
        signals = json.load(f)

    print(f"Loaded {Color.BOLD}{len(signals)} signals{Color.ENDC} from signals.json.")

    # Check API key status
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    api_key_status = f"{Color.GREEN}Available{Color.ENDC}" if api_key else f"{Color.WARNING}Missing (API will fall back to stub mode){Color.ENDC}"
    print(f"Claude API Key:      {api_key_status}")

    # Check backend connectivity
    is_online = False
    if not args.simulate:
        print("\nChecking backend connectivity...")
        is_online = check_backend_running(args.url)
        if is_online:
            print(f"{Color.GREEN}[✓] Connected to backend.{Color.ENDC}")
        else:
            print(f"{Color.WARNING}[!] Backend offline at {args.url}.{Color.ENDC}")
            print(f"To run with a live backend database, start it with:")
            print(f"  {Color.BOLD}backend\\.venv\\Scripts\\python.exe -m uvicorn main:app --reload{Color.ENDC}")
            print(f"  or: {Color.BOLD}cd backend && python -m uvicorn main:app --reload{Color.ENDC}")
            print("\nProceeding in SIMULATION MODE (offline visualizer).")
            args.simulate = True

    # --- Phase 1: Ingestion ---
    print_banner("PHASE 1: REAL-TIME TIME-COMPRESSED INGESTION", Color.BLUE)
    if not args.auto:
        input("\nPress Enter to start feeding fan signals... ")

    print(f"\nIngesting fan signals into {args.url}/api/signals (time-compressed)...")
    
    # Sort signals by timestamp to guarantee order
    signals.sort(key=lambda s: s["timestamp"])

    start_sim_time = time.time()
    last_timestamp = None

    for idx, sig in enumerate(signals, 1):
        is_spike = "sig_spike" in sig["id"] or (sig["location_zone"] == "Zone C" and any(w in sig["raw_text"].lower() for w in ["flood", "leak", "water", "overflow", "restroom"]))
        
        # Calculate compressed delay
        current_time = datetime.fromisoformat(sig["timestamp"])
        if last_timestamp is not None:
            delay = (current_time - last_timestamp).total_seconds() / args.speedup
            # Cap delay to keep presentation lively
            delay = min(max(0.0, delay), args.max_sleep)
            if delay > 0:
                time.sleep(delay)
        
        last_timestamp = current_time

        # Post to API if online
        if not args.simulate:
            try:
                # Prepare payload for FanSignalCreate
                payload = {
                    "source_type": sig["source_type"],
                    "location_zone": sig["location_zone"],
                    "raw_text": sig["raw_text"],
                    "sentiment_score": sig["sentiment_score"]
                }
                post_json(f"{args.url}/api/signals", payload)
            except Exception as e:
                # If a request fails, print and switch to simulation/skip mode to avoid crashing
                print(f"\n{Color.FAIL}[!] Request failed: {e}. Switching to offline simulation.{Color.ENDC}")
                args.simulate = True

        # Print feed item
        log_line = format_signal_log(sig, is_spike)
        print(log_line)

    print(f"\n{Color.GREEN}[✓] Ingested {len(signals)} signals successfully.{Color.ENDC}")

    # --- Phase 2: Semantic Clustering ---
    print_banner("PHASE 2: SEMANTIC CLUSTERING (CLAUDE 3.5 SONNET)", Color.CYAN)
    if not args.auto:
        input("\nPress Enter to trigger semantic clustering... ")

    clusters = []
    spike_cluster_id = None

    if not args.simulate:
        print("\nRequesting clusters from /api/clusters...")
        try:
            clusters = get_json(f"{args.url}/api/clusters")
            # Look for the Zone C restroom flood spike cluster
            for c in clusters:
                topic_lower = c.get("topic", "").lower()
                zone = c.get("zone", "")
                if zone == "Zone C" and any(k in topic_lower for k in ["flood", "leak", "water", "overflow", "restroom"]):
                    spike_cluster_id = c.get("id")
                    break
            
            # Fallback if no matching topic is found
            if not spike_cluster_id:
                zone_c_clusters = [c for c in clusters if c.get("zone") == "Zone C"]
                if zone_c_clusters:
                    largest_c = max(zone_c_clusters, key=lambda c: len(c.get("signal_ids", [])))
                    spike_cluster_id = largest_c.get("id")

            # Fallback if Claude returned empty list due to missing API key
            if not clusters:
                print(f"{Color.WARNING}[!] API returned empty cluster list (possibly missing ANTHROPIC_API_KEY).{Color.ENDC}")
                print("Using simulation clusters to demonstrate downstream flow...")
                clusters = MOCK_CLUSTERS
                spike_cluster_id = "clus_mock_spike_c"

        except Exception as e:
            print(f"{Color.FAIL}[!] Error calling /api/clusters: {e}. Using simulated clusters.{Color.ENDC}")
            clusters = MOCK_CLUSTERS
            spike_cluster_id = "clus_mock_spike_c"
    else:
        print("\nSimulating semantic clustering on local dataset...")
        time.sleep(1.5)
        clusters = MOCK_CLUSTERS
        spike_cluster_id = "clus_mock_spike_c"

    # Print clusters
    print(f"\n{Color.BOLD}{Color.CYAN}┌──────────────────────────────────────────────────────────────────────────────┐")
    print(f"│                        LIVE SEMANTIC CLUSTERS DETECTED                       │")
    print(f"└──────────────────────────────────────────────────────────────────────────────┘{Color.ENDC}")
    for c in clusters:
        is_spike = c.get("id") == spike_cluster_id
        cluster_color = Color.FAIL if is_spike else Color.GREEN
        marker = "🚨 [CRITICAL]" if is_spike else "📣 [ACTIVE]"
        
        print(f"  {Color.BOLD}{cluster_color}{marker} Cluster ID: {c.get('id')}{Color.ENDC}")
        print(f"  {Color.BOLD}Topic:{Color.ENDC}      {c.get('topic')}")
        print(f"  {Color.BOLD}Zone:{Color.ENDC}       {c.get('zone')}")
        print(f"  {Color.BOLD}Confidence:{Color.ENDC} {c.get('confidence_score')}")
        print(f"  {Color.BOLD}Signals:{Color.ENDC}    {len(c.get('signal_ids', []))} clustered reports")
        print(f"  {Color.BLUE}──────────────────────────────────────────────────────────────────────────────{Color.ENDC}")

    if not spike_cluster_id:
        print(f"\n{Color.WARNING}[!] Warning: Spike cluster could not be identified automatically.{Color.ENDC}")
        if clusters:
            spike_cluster_id = clusters[0].get("id")
            print(f"Negotiating on first cluster found: {spike_cluster_id}")
        else:
            print("No clusters available. Exiting.")
            sys.exit(1)

    # --- Phase 3: Operations Coordination / Negotiation ---
    print_banner("PHASE 3: CHIEF OPERATIONS COORDINATOR NEGOTIATION", Color.FAIL)
    print(f"Targeting Cluster: {Color.BOLD}{spike_cluster_id}{Color.ENDC}")
    if not args.auto:
        input("\nPress Enter to initiate agent consensus negotiations... ")

    consensus = None

    if not args.simulate and not (clusters == MOCK_CLUSTERS):
        print(f"\nSubmitting negotiation payload to /api/negotiate for cluster {spike_cluster_id}...")
        try:
            payload = {"cluster_id": spike_cluster_id}
            consensus = post_json(f"{args.url}/api/negotiate", payload)
            
            # Check if it returns fallback stub due to missing API key
            if consensus and "Fallback Consensus" in consensus.get("final_action", ""):
                print(f"\n{Color.WARNING}[!] Server returned fallback consensus due to missing ANTHROPIC_API_KEY.{Color.ENDC}")
                print("Presenting high-fidelity simulated agent consensus for pitch demonstration...")
                consensus = MOCK_CONSENSUS
        except Exception as e:
            print(f"{Color.FAIL}[!] Error calling /api/negotiate: {e}. Using simulated negotiation response.{Color.ENDC}")
            consensus = MOCK_CONSENSUS
    else:
        print("\nGathering opinions from Security, Concessions, Medical, Transit, and Broadcast agents...")
        time.sleep(2.0)
        consensus = MOCK_CONSENSUS

    # Print Consensus and Agent Opinions
    print(f"\n{Color.BOLD}{Color.HEADER}┌──────────────────────────────────────────────────────────────────────────────┐")
    print(f"│                  CHIEF OPERATIONS COORDINATOR ACTION PLAN                    │")
    print(f"└──────────────────────────────────────────────────────────────────────────────┘{Color.ENDC}")
    
    print(f"  {Color.BOLD}Consensus Action:{Color.ENDC}")
    import textwrap
    final_action = consensus.get("final_action", "")
    for line in final_action.split('\n'):
        wrapped_line = textwrap.fill(line, width=76, initial_indent="    ", subsequent_indent="    ")
        print(f"{Color.BOLD}{Color.GREEN}{wrapped_line}{Color.ENDC}")
    
    print(f"  {Color.BLUE}──────────────────────────────────────────────────────────────────────────────{Color.ENDC}")
    
    print(f"\n  {Color.BOLD}Contributing Agent Opinions:{Color.ENDC}")
    for o in consensus.get("contributing_opinions", []):
        agent_name = o.get("agent_name", "")
        rec = o.get("recommendation", "")
        reason = o.get("reasoning", "")
        constraints = o.get("constraints", [])
        
        agent_icons = {
            "SecurityAgent": "🛡️",
            "TransitAgent": "🚇",
            "ConcessionsAgent": "🍔",
            "BroadcastAgent": "🎥",
            "MedicalAgent": "🏥"
        }
        icon = agent_icons.get(agent_name, "🤖")
        
        print(f"\n    {Color.BOLD}{Color.CYAN}{icon} {agent_name}{Color.ENDC}")
        print(f"    {Color.BOLD}Rec:{Color.ENDC}        {rec}")
        print(f"    {Color.BOLD}Reasoning:{Color.ENDC}  {reason}")
        if constraints:
            print(f"    {Color.BOLD}Constraints:{Color.ENDC} " + ", ".join(constraints))
    print(f"\n{Color.BOLD}{Color.HEADER}└──────────────────────────────────────────────────────────────────────────────┘{Color.ENDC}")

    print_banner("DEMO SCENARIO RUN COMPLETED SUCCESSFULLY", Color.GREEN)
    print("The mock data has been fully ingested, clustered, and negotiated.")
    print("You can view the resulting state in real-time on your frontend web interface!")
    print(f"Frontend URL:        {Color.BOLD}http://localhost:5173/signals{Color.ENDC}")

if __name__ == "__main__":
    main()
