import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import PlexusBackground from '../components/PlexusBackground';
import '../styles/login.css';

/**
 * LoginPage Component
 * Exact visual recreation of the Pinterest reference (https://pin.it/3r0OubpM2)
 * with animated 3D Plexus / Constellation Background (https://pin.it/1VLhHTyYW)
 * adapted to the GWC Manufacturing 360° Brand Color Palette:
 * - Background: Slow-motion 3D floating particle plexus network with connecting
 *   lines and translucent triangular mesh facets in GWC purple/indigo/cyan.
 * - Left side: White form container with Sign In/Sign Up inputs,
 *   clean input fields, "Forget Password?", and vibrant brand-purple SIGN IN button.
 * - Right side: Radiant brand-purple welcome panel with "Hello World",
 *   "Sign up now and enjoy our site", and white pill ghost "SIGN UP" button.
 * - Mandatory credential gate before proceeding to main application.
 */
export default function LoginPage({ onLoginSuccess }) {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState('admin@gwcdata.ai');
  const [password, setPassword] = useState('••••••••••');
  const [name, setName] = useState('Operations Lead');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setToastMessage('');

    // Simulate crisp enterprise auth validation
    setTimeout(() => {
      setIsLoading(false);
      setLoginSuccess(true);
      try {
        localStorage.setItem('gwc_user_authenticated', 'true');
        localStorage.setItem('gwc_auth_user', JSON.stringify({
          email: email || 'admin@gwcdata.ai',
          name: name || 'Enterprise Admin',
          role: 'Plant Operations Director'
        }));
      } catch (err) {
        console.warn('Could not persist auth state:', err);
      }

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          window.location.search = '?tab=home';
        }
      }, 250);
    }, 300);
  };

  const fillDemoCredentials = () => {
    setEmail('director@gwcdata.ai');
    setPassword('Manufacturing2026!');
    setToastMessage('Pre-filled enterprise demo credentials');
    setTimeout(() => setToastMessage(''), 2500);
  };

  return (
    <div className="login-page-viewport">
      {/* 3D Plexus / Constellation Background Network (Pinterest reference: https://pin.it/1VLhHTyYW) */}
      <PlexusBackground />

      {/* Top Left Brand Watermark */}
      <div className="login-header-brand" title="GWC Manufacturing 360°">
        <img
          src="/assets/gwc-logo.png"
          alt="GWC DATA.AI"
          className="login-brand-logo"
        />
        <span className="login-brand-title">
          Manufacturing 360°
          <span className="login-brand-badge">Enterprise Mesh</span>
        </span>
      </div>

      {/* Main Authentication Split Card */}
      <div className="auth-card-container">
        <div className={`auth-split-wrapper ${isSignUpMode ? 'mode-signup' : ''}`}>
          
          {/* ============================================================= */}
          {/* FORM SIDE (White Panel)                                       */}
          {/* ============================================================= */}
          <div className="auth-form-side">
            <h1 className="auth-heading">
              {isSignUpMode ? 'Create Account' : 'Sign In'}
            </h1>

            {/* Toast alert if message active */}
            {toastMessage && (
              <div className="auth-toast-alert">
                {toastMessage}
              </div>
            )}

            {/* Credential Inputs Form */}
            <form className="auth-form" onSubmit={handleSubmit}>
              {isSignUpMode && (
                <div className="auth-input-group">
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="auth-input-group">
                <input
                  type="email"
                  className="auth-input"
                  placeholder="Enter E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-input-group">
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {!isSignUpMode && (
                <a
                  href="#forgot"
                  className="auth-forgot-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setToastMessage('Reset password link sent to registered email.');
                    setTimeout(() => setToastMessage(''), 3000);
                  }}
                >
                  Forget Password?
                </a>
              )}

              {/* Action Button */}
              <button
                type="submit"
                className="auth-btn-solid"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : loginSuccess ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Welcome!</span>
                  </>
                ) : (
                  <span>{isSignUpMode ? 'SIGN UP' : 'SIGN IN'}</span>
                )}
              </button>
            </form>

            {/* One-Click Demo Helper */}
            <div className="auth-demo-pill" onClick={fillDemoCredentials}>
              <Sparkles size={12} color="#6f3dba" />
              <span>Fill Enterprise Demo Credentials</span>
            </div>
          </div>

          {/* ============================================================= */}
          {/* WELCOME / SWITCHER PANEL (Brand Purple Panel)                 */}
          {/* ============================================================= */}
          <div className="auth-welcome-side">
            <h2 className="auth-welcome-title">
              {isSignUpMode ? 'Welcome Back!' : 'Hello World'}
            </h2>

            <p className="auth-welcome-subtitle">
              {isSignUpMode
                ? 'To keep connected with us please sign in with your enterprise credentials'
                : 'Sign up now and enjoy our site'}
            </p>

            <button
              type="button"
              className="auth-btn-ghost"
              onClick={() => setIsSignUpMode(!isSignUpMode)}
            >
              {isSignUpMode ? 'SIGN IN' : 'SIGN UP'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
