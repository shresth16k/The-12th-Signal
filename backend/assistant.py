import os
import sys

from anthropic import Anthropic

# Add parent directory to path to support imports if run from root/elsewhere
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from models import FanProfile


def get_day_plan(profile: FanProfile) -> str:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Warning: ANTHROPIC_API_KEY not found. Returning a stub day plan.")
        mobility_info = (
            f"Accessibility considerations: {profile.mobility_needs}"
            if profile.mobility_needs
            else "No special mobility access requirements reported."
        )
        food_info = (
            f"Dietary notes: {', '.join(profile.food_preferences)}"
            if profile.food_preferences
            else "No dietary restrictions reported."
        )
        arrival_str = (
            profile.arrival_time.strftime("%Y-%m-%d %H:%M:%S") if profile.arrival_time else "Flexible/Not specified"
        )
        return f"""
Welcome to the FIFA World Cup 2026 Match Day! (Fallback Stub Plan)
------------------------------------------------------------------
Language: {profile.language}
Seat Zone: {profile.seat_zone}
{mobility_info}
{food_info}

Arrival Recommendation:
Plan to arrive near your expected arrival time ({arrival_str}). Use the main entrance gates closest to {profile.seat_zone}.

Food & Beverage Suggestions:
Check out concession stands in your designated seating zone ({profile.seat_zone}) for standard food options.

Accessible Navigation:
Follow stadium signage directly to {profile.seat_zone}. Elevators are located at all primary gates.
"""

    client = Anthropic(api_key=api_key)

    mobility_context = (
        f"- Mobility/accessibility needs: {profile.mobility_needs}"
        if profile.mobility_needs
        else "- No specific mobility needs requested (standard walking routes)."
    )
    food_context = (
        f"- Food preferences: {', '.join(profile.food_preferences)}"
        if profile.food_preferences
        else "- No specific food restrictions."
    )
    arrival_str = profile.arrival_time.isoformat() if profile.arrival_time else "Flexible/Not specified"
    arrival_context = f"- Expected Arrival Time: {arrival_str}"

    prompt = f"""
You are the GenAI Fan Experience Assistant for the FIFA World Cup 2026.
Your job is to generate a personalized, warm, and helpful match-day guide for a spectator based on their fan profile.

Fan Profile details:
- Seating Zone: {profile.seat_zone}
- Preferred Language: {profile.language}
{arrival_context}
{mobility_context}
{food_context}

Please draft a personalized match-day plan. You must write the plan in the fan's preferred language ({profile.language}). If the language is not English, you may write it in that language or provide a translation.
Ensure the plan covers:
1. **Arrival & Gate Tips**: Specific gates/timings to arrive near {profile.seat_zone}.
2. **Food & Concession Recommendations**: Tailored food stand suggestions matching their food preferences (e.g. halal, vegetarian, vegan, gluten-free, etc.).
3. **Route & Navigation Instructions**: Directing them to their seat. Pay special attention to elevators, ramps, or flat routes if they have mobility needs.

Keep the tone energetic, welcoming, and clear. Return the plan as plain text only.
"""

    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=1500,
            system="You are a helpful stadium assistant writing personalized, warm match-day plans for football fans.",
            messages=[{"role": "user", "content": prompt}],
        )
        return response.content[0].text.strip()
    except Exception as e:
        print(f"Error generating day plan: {e}")
        return "Unable to generate personalized plan at this moment. Please check stadium signage or consult a steward."
