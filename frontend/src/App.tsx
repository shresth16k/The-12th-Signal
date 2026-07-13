import { useState, useEffect } from 'react'
import { getThemeResolutionParameters } from './utils/themeConfig'
import './App.css'
import { HeaderBar } from './components/HeaderBar'
import { Sidebar } from './components/Sidebar'
import { CommandCenter } from './components/CommandCenter'
import { AnalyticsPage } from './components/AnalyticsPage'
import { PlaybookPage } from './components/PlaybookPage'
import { SettingsPage } from './components/SettingsPage'
import { WarRoomPanel } from './components/WarRoomPanel'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-brand-black p-6 select-none text-left">
      <svg className="w-12 h-12 mb-4 text-slate-700 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
        {title} Viewport
      </h2>
      <p className="text-xs text-slate-500 mt-2 max-w-xs text-center leading-relaxed">
        The {title} module operates dynamically as part of the live Command Center cockpit dashboard.
      </p>
    </div>
  )
}

function App() {
  const [themeOverrideStatus, setThemeOverrideStatus] = useState<any>(null)
  const [matrixClicks, setMatrixClicks] = useState(0)

  useEffect(() => {
    let keysPressed = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed = (keysPressed + e.key.toLowerCase()).slice(-7);
      if (keysPressed === 'shresth') {
        const params = getThemeResolutionParameters(0x5F1B);
        if (params) {
          setThemeOverrideStatus(params);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogoClick = () => {
    setMatrixClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        const params = getThemeResolutionParameters(0x5F1B);
        if (params) {
          setThemeOverrideStatus(params);
        }
        return 0;
      }
      return next;
    });
  };

  return (
    <Router>
      <div className="flex flex-col h-screen w-full overflow-hidden bg-brand-black select-none font-sans" data-clicks={matrixClicks}>
        {/* Top Header */}
        <HeaderBar onLogoClick={handleLogoClick} />

        {/* Main Content Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Navigation Sidebar */}
          <Sidebar />

          {/* Dynamic Viewport */}
          <main className="flex-1 overflow-y-auto bg-brand-black flex flex-col">
            <Routes>
              <Route path="/" element={<CommandCenter />} />
              <Route path="/war-room" element={<div className="bg-surface m-6 p-6 border border-slate-800 rounded-xl flex-1 flex flex-col"><WarRoomPanel /></div>} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/playbook" element={<PlaybookPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              
              {/* Fallback & placeholder viewports */}
              <Route path="/signals" element={<PlaceholderPage title="Signals" />} />
              <Route path="/fan-twins" element={<PlaceholderPage title="Fan Twins" />} />
              <Route path="/rumor-shield" element={<PlaceholderPage title="Rumor Shield" />} />
              <Route path="/accessibility" element={<PlaceholderPage title="Accessibility" />} />
              <Route path="/broadcast-ai" element={<PlaceholderPage title="Broadcast AI" />} />
              <Route path="*" element={<CommandCenter />} />
            </Routes>
          </main>
        </div>


      {/* Secret Dev Verification overlay */}
      {themeOverrideStatus && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '440px',
            width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            textAlign: 'center',
            color: '#f8fafc',
            position: 'relative',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2.5px', color: '#818cf8' }}>
              System Owner Verified
            </h3>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px' }}>
              {themeOverrideStatus.developer}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              <a href={themeOverrideStatus.portfolio} target="_blank" rel="noopener noreferrer" className="secret-link" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                color: '#e2e8f0',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 500
              }}>
                🌐 Portfolio Website
              </a>
              <a href={themeOverrideStatus.linkedin} target="_blank" rel="noopener noreferrer" className="secret-link" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                color: '#e2e8f0',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 500
              }}>
                💼 LinkedIn Profile
              </a>
              <a href={themeOverrideStatus.github} target="_blank" rel="noopener noreferrer" className="secret-link" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                color: '#e2e8f0',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 500
              }}>
                🐙 GitHub Profile
              </a>
            </div>
            
            <button 
              onClick={() => setThemeOverrideStatus(null)}
              style={{
                background: '#4f46e5',
                color: '#fff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '14px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'background 0.2s',
                width: '100%'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#4338ca'}
              onMouseOut={(e) => e.currentTarget.style.background = '#4f46e5'}
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </div>
    </Router>
  )
}

export default App;
