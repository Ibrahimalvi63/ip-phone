'use client';
import { useState, useCallback } from 'react';
import useTwilio, { CALL_STATE } from '../hooks/useTwilio';
import DialerTab from './dialer/DialerTab';
import CallsTab from './dialer/CallsTab';
import ContactsTab from './dialer/ContactsTab';
import SettingsTab from './dialer/SettingsTab';
import ActiveCallOverlay from './dialer/ActiveCallOverlay';
import IncomingCallModal from './dialer/IncomingCallModal';
import DeviceStatusBar from './dialer/DeviceStatusBar';

const TABS = [
  { id: 'dialer', label: 'Dialer', icon: <DialIcon /> },
  { id: 'calls', label: 'Calls', icon: <CallsIcon /> },
  { id: 'contacts', label: 'Contacts', icon: <ContactsIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];

export default function AppShell({ authToken, username, onLogout }) {
  const [activeTab, setActiveTab] = useState('dialer');
  const [dialTarget, setDialTarget] = useState(''); // pre-fill dialer from contacts/calls
  const [contactTarget, setContactTarget] = useState('')//pre-fill contacts from dialer

  const twilio = useTwilio(authToken);
  const { callState, incomingCall, deviceReady, deviceError } = twilio;

  const isInCall = callState === CALL_STATE.IN_CALL || callState === CALL_STATE.CONNECTING;

  const handleDialFromHistory = useCallback((number) => {
    setDialTarget(number);
    setActiveTab('dialer');
  }, []);

  const handleContactFromDialer = useCallback((number) => {
    setContactTarget(number);
    setActiveTab('contacts');
  }, []);

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#0f0f0f] overflow-hidden">

      {/* Device status bar */}
      <DeviceStatusBar
        deviceReady={deviceReady}
        deviceError={deviceError}
        onRetry={twilio.reinitDevice}
      />

      {/* Incoming call modal */}
      {incomingCall && (
        <IncomingCallModal
          call={incomingCall}
          onAccept={twilio.acceptIncoming}
          onReject={twilio.rejectIncoming}
        />
      )}

      {/* Active call overlay (mini bar) shown on all tabs when in call */}
      {isInCall && activeTab !== 'dialer' && (
        <div
          className="mx-3 mt-2 bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.25)] rounded-2xl px-4 py-2.5 flex items-center justify-between cursor-pointer"
          onClick={() => setActiveTab('dialer')}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-sm font-medium text-[#00ff88]">
              {callState === CALL_STATE.CONNECTING ? 'Connecting…' : 'In Call'}
            </span>
            <span className="text-sm text-gray-400">{twilio.currentNumber}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); twilio.hangUp(); }}
            className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
            </svg>
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'dialer' && (
          <DialerTab twilio={twilio} onContact={handleContactFromDialer} prefillNumber={dialTarget} onPrefillConsumed={() => setDialTarget('')} />
        )}
        {activeTab === 'calls' && (
          <CallsTab onDial={handleDialFromHistory} />
        )}
        {activeTab === 'contacts' && (
          <ContactsTab onDial={handleDialFromHistory} prefillContact={contactTarget} onPrefillConsumed={() => setContactTarget('')} />
        )}
        {activeTab === 'settings' && (
          <SettingsTab username={username} onLogout={onLogout} onReinitDevice={twilio.reinitDevice} />
        )}
      </div>

      {/* Bottom nav */}
      <nav className="flex-shrink-0 bg-[#1a1a1a] border-t border-[#2a2a2a] pb-safe">
        <div className="flex">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-150 ${activeTab === tab.id ? 'text-[#00ff88]' : 'text-gray-600 hover:text-gray-400'
                }`}
            >
              <span className={`transition-transform duration-150 ${activeTab === tab.id ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function DialIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" /></svg>;
}
function CallsIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2z" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>;
}
function ContactsIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>;
}
function SettingsIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>;
}
