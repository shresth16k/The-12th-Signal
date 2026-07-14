# Judge Presentation Walkthrough Script

This script provides a 5-minute presentation guide for showcasing **The 12th Signal** to hackathon judges. It references the key components, execution steps, and maps each section to its respective **Rubric Category**.

---

### **Minute 0:00 - 0:45 | Introduction & Problem Alignment**
*   **Visual**: Open the main Command Center Dashboard (`http://localhost:5173`). Focus on the tournament branding, team scores (USA vs MEX), and real-time activity metrics.
*   **Talk Track**: 
    > "Welcome judges. Today we present *The 12th Signal*—a GenAI stadium operations cockpit built specifically for the FIFA World Cup 2026. Traditional stadiums are passive, but *The 12th Signal* treats fans-as-sensors. By converting voice, app taps, AR feeds, and social posts into real-time operational data, we optimize crowd safety and tournament efficiency."
*   **Rubric Category**: 
    > **[Problem Statement Alignment]** — Integrates tournament-scale operations (FIFA 2026 USA vs Mexico layout) with real-time fan assistance and stadium intelligence.

---

### **Minute 0:45 - 1:45 | Real-Time Signal Ingestion & Pulse**
*   **Visual**: Run the demo script or open the Spatial Zone Map showing Zones A–J. Show the sentiment breakdown bars shifting and the live "Active Signals" updating.
*   **Talk Track**:
    > "Here, our time-compressed pipeline is feeding 200 real-time signals into the backend. These are semantically clustered in the background to separate noise from actual events. Look at our Stadium Pulse card—it dynamically reflects crowd sentiment, showing negative spikes during localized incidents like water leaks or restroom overflows."
*   **Rubric Category**:
    > **[Efficiency]** — Low-latency processing of unstructured fan data, featuring automated background clustering to ensure operators are not overwhelmed by raw feeds.

---

### **Minute 1:45 - 3:00 | The AI War Room & Multi-Agent Debate**
*   **Visual**: Click on the active Zone C Restroom Flooding cluster. Watch the War Room Panel spin and display the contributing opinions from **Security, Concessions, Medical, Transit, and Broadcast** agents.
*   **Talk Track**:
    > "When an incident spikes, we initiate a multi-agent negotiation. Security advises rerouting, Concessions suspends nearby POS registers, Medical places slip-and-fall staff on standby, Transit updates incoming gate shuttle routes, and Broadcast redirects camera angles. The Chief Operations coordinator compiles these conflicting constraints into a single, cohesive Consensus Action Plan."
*   **Rubric Category**:
    > **[Code Quality]** — Uses decoupled, specialized agent classes (`security_agent.py`, `concessions_agent.py`, etc.) operating with strict Pydantic schemas (`models.py`) to validate inter-agent messaging.

---

### **Minute 3:00 - 4:00 | Security & The Rumor Shield**
*   **Visual**: Submit or simulate a signal containing panic language (e.g., false evacuation warnings). Show the Rumor Shield intercepting the cluster.
*   **Talk Track**:
    > "In tournament events, false rumors can cause dangerous crowd stampedes. Our dedicated Rumor Agent inspects clusters for panic triggers. If a rumor is detected, the system immediately short-circuits standard operational debate to output an emergency correction broadcast, calming the crowd before panic spreads."
*   **Rubric Category**:
    > **[Security]** — Implements rumor interception and panic dampening to protect stadium integrity and crowd safety.

---

### **Minute 4:00 - 5:00 | Fan Twin Companion & Accessibility**
*   **Visual**: Navigate to the Fan Twin mobile view (`http://localhost:5173/fan-twins`). Adjust the text sizes and toggle high-contrast options. Submit a question to the Fan Twin chat.
*   **Talk Track**:
    > "Finally, let's look at the fan's experience. The Fan Twin provides personalized assistance, custom day-plans, and gate navigation based on their seat ticket and preferences. Most importantly, it supports accessibility adjustments for high-contrast viewing and larger text, ensuring that every tournament attendee can navigate the stadium safely."
*   **Rubric Category**:
    > **[Accessibility]** — Integrates accessibility overrides and high-contrast support, verified via Vitest unit tests in `FanAccessibilitySettings.test.jsx`.
    > **[Testing]** — Full coverage suite verified via `run_all_tests.sh` (using pytest-cov and Vitest) and E2E Playwright verification.
