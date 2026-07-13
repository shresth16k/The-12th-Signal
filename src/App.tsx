import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { getThemeResolutionParameters } from './utils/themeConfig'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
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
      <section id="center">
        <div className="hero" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>

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
