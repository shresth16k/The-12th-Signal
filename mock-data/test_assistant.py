import os
import sys
from datetime import datetime, timezone

# Add backend directory to path to import models and assistant
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from models import FanProfile
from assistant import get_day_plan

# Load environment variables if .env exists
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env')))
except ImportError:
    pass

def run_test():
    # Create a mock FanProfile
    mock_profile = FanProfile(
        id="fan_shresth_99",
        language="Spanish",
        mobility_needs="Wheelchair user, needs step-free access and seating space",
        seat_zone="Zone C, Section 104",
        food_preferences=["Vegetarian", "Gluten-Free"],
        arrival_time=datetime(2026, 7, 13, 18, 30, tzinfo=timezone.utc)
    )

    print("Testing Assistant with Fan Profile:")
    print(f" - ID:         {mock_profile.id}")
    print(f" - Language:   {mock_profile.language}")
    print(f" - Mobility:   {mock_profile.mobility_needs}")
    print(f" - Seat Zone:  {mock_profile.seat_zone}")
    print(f" - Preferences: {', '.join(mock_profile.food_preferences)}")
    print(f" - Arrival:    {mock_profile.arrival_time}")

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("\n[WARNING] ANTHROPIC_API_KEY environment variable is not set.")
        print("Running in stub/fallback mode.")
    else:
        print("\nInvoking live Claude 3.5 Sonnet to generate personalized plan...")

    plan = get_day_plan(mock_profile)

    print("\n" + "=" * 80)
    print("PERSONALIZED MATCH-DAY PLAN:")
    print("=" * 80)
    print(plan)
    print("=" * 80)

if __name__ == "__main__":
    run_test()
