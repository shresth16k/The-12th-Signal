# Problem Statement Alignment

This document outlines how **The 12th Signal** aligns directly with the official Prompt Wars problem statement:
> **"Smart Stadiums & Tournament Operations — GenAI-powered solution to optimize stadium operations and enhance the FIFA World Cup 2026 experience through intelligent, real-time assistance."**

---

| Official Requirement | How This Project Addresses It | File(s) / Component(s) |
| :--- | :--- | :--- |
| **Real-time Assistance** | Fans submit issues (voice transcripts, app taps, AR reports) instantly. In return, a personalized GenAI-powered chat assistant ("Fan Twin") answers questions, plans itineraries, and offers navigation/assistance. | - `frontend/src/components/SignalSubmit.jsx`<br>- `frontend/src/components/FanTwinChat.jsx`<br>- `backend/assistant.py` (LLM-generated fan guidance) |
| **Stadium Operations Optimization** | Crowd signals are dynamically grouped into semantic clusters. A multi-agent orchestrator calls 5 dedicated operational agents (Security, Concessions, Medical, Transit, Broadcast), who negotiate opinions under constraints to output a unified, step-by-step master plan. | - `backend/orchestrator.py` (Multi-agent coordinator)<br>- `backend/agents/security_agent.py`<br>- `backend/agents/concessions_agent.py`<br>- `backend/agents/medical_agent.py`<br>- `backend/agents/transit_agent.py`<br>- `backend/agents/broadcast_agent.py`<br>- `frontend/src/components/WarRoomPanel.tsx` (AI War Room dashboard) |
| **GenAI-powered Intelligence** | Uses Claude 3.5 Sonnet to cluster unstructured fan signals and to power the agent debate. The system also includes a specialized **Rumor Shield** agent that intercepts panic language and short-circuits operations to push verified safety corrections. | - `backend/clustering.py` (LLM semantic clusterer)<br>- `backend/agents/rumor_agent.py` (Panic/rumor safety interceptor)<br>- `frontend/src/components/RumorShieldCard.tsx` |
| **Tournament-scale Scenario (FIFA World Cup 2026)** | Configured to process high-throughput simulated matching signals (e.g. USA vs Mexico) mapped across 10 spatial zones (Zones A–J) in the stadium layout, ensuring localized operations coordination. | - `frontend/src/components/StadiumZoneMap.tsx`<br>- `frontend/src/components/StadiumPulse.tsx`<br>- `mock-data/generate_signals.py`<br>- `mock-data/run_demo_scenario.py` |
| **Fan Experience Enhancement** | Provides a personal companion that adapts to fan profiles (such as accessibility settings, language preferences, and seats) and actively shields fans from misinformation during panic-prone incidents. | - `frontend/src/components/FanAccessibilitySettings.jsx`<br>- `backend/models.py` (Schemas for `FanProfile`, `FanSignal`, `AgentOpinion`) |
