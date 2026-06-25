'use client';
import { useState, useEffect } from 'react';
import LoginScreen from '../components/LoginScreen';
import AppShell from '../components/AppShell';
import { getAuthToken, getAuthUser, setAuth, clearAuth } from '../lib/storage';

export default function Page() {
  const [authToken, setAuthToken] = useState(null);
  const [username, setUsername]   = useState('');
  const [ready, setReady]         = useState(false);

  useEffect(() => {
    const t = getAuthToken();
    if (t) { setAuthToken(t); setUsername(getAuthUser()); }
    setReady(true);
  }, []);

  const handleLogin = (token, user, expiresIn) => {
    setAuth(token, user, expiresIn);
    setAuthToken(token);
    setUsername(user);
  };

  const handleLogout = () => {
    clearAuth();
    setAuthToken(null);
    setUsername('');
  };

  if (!ready) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#00ff88] border-t-transparent animate-spin" />
    </div>
  );

  return authToken
    ? <AppShell authToken={authToken} username={username} onLogout={handleLogout} />
    : <LoginScreen onLogin={handleLogin} />;
}
