import { useState, useEffect } from 'react'
import { getThemeResolutionParameters } from './utils/themeConfig'
import './App.css'

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
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        backgroundColor: '#0f172a'
      }} onClick={handleLogoClick} data-clicks={matrixClicks}>
        <h1 style={{ cursor: 'pointer', fontSize: '4rem', margin: 0, fontWeight: 800, letterSpacing: '-1px' }}>OK</h1>
        <p style={{ opacity: 0.5, marginTop: '8px', fontSize: '1.1rem' }}>The 12th Signal — Stadium Operations System</p>
      </div>

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
    </>
  )
}

export default App
