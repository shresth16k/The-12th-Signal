import React, { useState, useRef, useEffect } from 'react';

/**
 * FanTwinChat component for the fan-facing mobile view of "The 12th Signal".
 * A full chat-style interface providing interactive matchday assistance.
 */
export default function FanTwinChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'Hi Arjun! 👋 Everything is set for your perfect match day experience at Lumen Field.',
      time: '19:40',
    },
    {
      id: 2,
      sender: 'assistant',
      text: 'I can help you check restroom lines, concession wait times, stadium navigation, or accessibility assistance.',
      time: '19:40',
    },
    {
      id: 3,
      sender: 'user',
      text: 'Where is the best place to get food right now?',
      time: '19:41',
    },
    {
      id: 4,
      sender: 'assistant',
      text: 'Grab dinner at Stand C. It has a shorter line. Estimated wait: 8 mins.',
      time: '19:42',
    },
    {
      id: 5,
      sender: 'user',
      text: 'Is Gate 3 crowded?',
      time: '19:43',
    },
    {
      id: 6,
      sender: 'assistant',
      text: "Gate 3 is currently clear. I've updated your recommended route to avoid congestion at Gate 4.",
      time: '19:43',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Retrieve stored FanProfile or initialize a default one
  const getStoredProfile = () => {
    const profileKey = 'fan_profile';
    const profile = localStorage.getItem(profileKey);
    if (!profile) {
      const defaultProfile = {
        id: 'fan_12',
        language: 'English',
        mobility_needs: 'wheelchair access',
        seat_zone: 'Section 212',
        food_preferences: ['halal', 'vegetarian'],
        arrival_time: new Date(Date.now() + 3600000).toISOString(),
      };
      localStorage.setItem(profileKey, JSON.stringify(defaultProfile));
      return defaultProfile;
    }
    return JSON.parse(profile);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessageText = inputValue;

    // Append new user message to local state
    const userMsg = {
      id: messages.length + 1,
      sender: 'user',
      text: userMessageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    // Append temporary loading state bubble
    const loadingId = messages.length + 2;
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        sender: 'assistant',
        text: 'Analyzing live crowd signals and generating day plan...',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    try {
      const host =
        window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:8000'
          : '';

      const profile = getStoredProfile();

      const response = await fetch(`${host}/api/day-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        const data = await response.json();
        // Replace thinking bubble with response plan
        setMessages((prev) => prev.map((msg) => (msg.id === loadingId ? { ...msg, text: data.plan } : msg)));
      } else {
        throw new Error('API call failed');
      }
    } catch (err) {
      console.error('Error calling day-plan API:', err);
      // Replace with error warning
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                text: "I'm sorry, I'm unable to connect to stadium services. Please consult stadium staff or follow zone signs.",
              }
            : msg
        )
      );
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  const suggestions = [
    '🍔 Shortest food line?',
    '🚶‍♂️ Route to Gate 3',
    '🚽 Restroom Section 212',
    '🩺 Medical Assistance',
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-brand-black/95 relative overflow-hidden">
      {/* 1. Chat Assistant Header / Profile */}
      <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* Glowing Avatar */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-purple to-positive-teal rounded-full blur opacity-65"></div>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256"
              alt="AI Twin"
              className="relative w-8 h-8 rounded-full border border-slate-700 object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-positive-teal border-2 border-slate-900 rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <h4 className="text-xs font-extrabold text-slate-100 tracking-tight">AI MATCHDAY TWIN</h4>
            <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase">Personal Companion</span>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-positive-teal/10 border border-positive-teal/20">
          <span className="w-1 h-1 rounded-full bg-positive-teal" />
          <span className="text-[8.5px] font-bold text-positive-teal uppercase tracking-wider">Syncing</span>
        </div>
      </div>

      {/* 2. Greeting Banner */}
      <div className="mx-3 mt-3 px-3 py-2 bg-gradient-to-r from-accent-purple/10 to-indigo-950/20 border border-accent-purple/15 rounded-xl text-left shadow-sm">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-accent-purple/20 flex items-center justify-center text-accent-purple shrink-0 text-xs">
            ✨
          </div>
          <div>
            <h5 className="text-[10px] font-bold text-slate-200 uppercase tracking-wide">
              Stadium Nervous System Active
            </h5>
            <p className="text-[9.5px] text-slate-400 mt-0.5 leading-relaxed">
              We sync with stadium crowd cameras and gate sensors to guide you.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Messages Window */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3.5 custom-scrollbar min-h-0">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            >
              {/* Message Bubble */}
              <div
                className={`px-3 py-2 rounded-2xl text-[11px] leading-relaxed text-left transition-all duration-200 ${
                  isUser
                    ? 'bg-gradient-to-r from-accent-purple to-indigo-600 text-slate-100 rounded-tr-sm shadow-md'
                    : 'bg-slate-900/80 border border-slate-800/80 text-slate-200 rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>

              {/* Timestamp */}
              <span className="text-[8px] text-slate-500 font-mono mt-1 px-1">{msg.time}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Suggestion Quick-Chips */}
      <div className="px-3 pb-2 pt-1 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handleSuggestionClick(suggestion)}
            className="px-2.5 py-1 rounded-full bg-slate-900/60 hover:bg-slate-800 text-[9px] font-medium text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200 shrink-0 cursor-pointer"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* 5. Chat Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-slate-900/40 border-t border-slate-800/60 flex items-center gap-2 shrink-0 backdrop-blur-md"
      >
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask your Match Day Twin..."
            className="w-full bg-slate-950/80 border border-slate-800/80 hover:border-slate-700/80 focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/30 rounded-xl pl-3 pr-8 py-2 text-[11px] text-slate-100 placeholder-slate-500 focus:outline-none transition-all duration-200"
          />
          {/* Action icon (mic) inside input */}
          <button type="button" className="absolute right-2.5 text-slate-500 hover:text-slate-300 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className={`p-2 rounded-xl flex items-center justify-center transition-all duration-300 border ${
            inputValue.trim()
              ? 'bg-accent-purple hover:bg-accent-purple/90 text-white border-accent-purple/50 shadow-md hover:shadow-accent-purple/20 cursor-pointer active:scale-95'
              : 'bg-slate-950/50 text-slate-600 border-slate-850 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          <svg
            className="w-3.5 h-3.5 transform rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}
