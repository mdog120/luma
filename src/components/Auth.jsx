import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Coffee, Mail, Lock, LogIn, UserPlus, HelpCircle } from 'lucide-react';

export default function Auth({ onAuthSuccess }) {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    if (!email || !password) {
      setMessage({ text: 'Please fill in all fields.', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({ text: 'Sign up successful! You are now logged in.', type: 'success' });
        if (data?.session) {
          onAuthSuccess && onAuthSuccess(data.session);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage({ text: 'Logged in successfully!', type: 'success' });
        if (data?.session) {
          onAuthSuccess && onAuthSuccess(data.session);
        }
      }
    } catch (error) {
      setMessage({ text: error.message || 'An error occurred during authentication.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      // Instantly enter Guest Mode without hitting Supabase auth rate limits
      const session = {
        access_token: 'guest-token',
        user: { id: 'guest-user', email: 'guest@luma-cafe.local' }
      };
      onAuthSuccess && onAuthSuccess(session);
    } catch (error) {
      setMessage({ text: 'Could not start Guest Mode: ' + error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-circle">
            <Coffee className="auth-logo-icon" size={32} />
          </div>
          <h1>Luma</h1>
          <p>Your cozy focus cafe</p>
        </div>

        <form onSubmit={handleAuth} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                id="email"
                type="email"
                placeholder="coffee@luma.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {message.text && (
            <div className={`auth-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : isSignUp ? (
              <>
                <UserPlus size={18} />
                <span>Create Café Account</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Enter Café</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-toggle">
          {isSignUp ? (
            <p>
              Already have a café?{' '}
              <button type="button" onClick={() => setIsSignUp(false)} className="toggle-link">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to Luma?{' '}
              <button type="button" onClick={() => setIsSignUp(true)} className="toggle-link">
                Create an Account
              </button>
            </p>
          )}
        </div>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button type="button" className="auth-guest-btn" onClick={handleGuestMode} disabled={loading}>
          <span>Play as Guest</span>
        </button>

        {supabase.isMock && (
          <div className="auth-note">
            <HelpCircle size={14} className="note-icon" />
            <span>Running in offline Local Storage mode. Set your Supabase keys in a `.env` file to enable permanent account syncing!</span>
          </div>
        )}
      </div>
    </div>
  );
}
