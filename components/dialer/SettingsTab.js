'use client';
import { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../../lib/storage';
import { COUNTRY_CODES } from '../../lib/utils';

export default function SettingsTab({ username, onLogout, onReinitDevice }) {
  const [settings, setSettings] = useState(getSettings());
  const [saved, setSaved] = useState(false);

  const update = (key, value) => {
    const updated = saveSettings({ [key]: value });
    setSettings(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold">Settings</h1>
        {saved && (
          <span className="text-xs text-[#00ff88] font-medium animate-fade-in">Saved ✓</span>
        )}
      </div>

      {/* Account section */}
      <Section title="Account">
        <Row label="Logged in as" value={username} icon={<UserIcon />} />
        <Row
          label="Display Name"
          icon={<TagIcon />}
          control={
            <input
              type="text"
              value={settings.displayName}
              onChange={e => update('displayName', e.target.value)}
              className="bg-transparent text-right text-sm text-[#00ff88] outline-none max-w-[150px]"
            />
          }
        />
        <button
          onClick={onReinitDevice}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#242424] transition-colors"
        >
          <span className="w-8 h-8 rounded-xl bg-[#242424] flex items-center justify-center text-blue-400">
            <RefreshIcon />
          </span>
          <span className="flex-1 text-left text-sm text-white">Reconnect Voice Device</span>
        </button>
      </Section>

      {/* Call settings */}
      <Section title="Calls">
        <Row
          label="Default Country Code"
          icon={<GlobeIcon />}
          control={
            <select
              value={settings.countryCode}
              onChange={e => update('countryCode', e.target.value)}
              className="bg-transparent text-right text-sm text-[#00ff88] outline-none"
            >
              {COUNTRY_CODES.map(c => (
                <option key={c.code} value={c.code} style={{ background: '#1e1e1e' }}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
          }
        />
        <ToggleRow
          label="Ringtone"
          icon={<BellIcon />}
          value={settings.ringtone}
          onChange={v => update('ringtone', v)}
        />
        <ToggleRow
          label="Keypad Click Sound"
          icon={<SoundIcon />}
          value={settings.keypadClick}
          onChange={v => update('keypadClick', v)}
        />
        <ToggleRow
          label="Call Waiting"
          icon={<WaitIcon />}
          value={settings.callWaiting}
          onChange={v => update('callWaiting', v)}
        />
        <ToggleRow
          label="Do Not Disturb"
          icon={<DNDIcon />}
          value={settings.doNotDisturb}
          onChange={v => update('doNotDisturb', v)}
          danger
        />
      </Section>

      {/* Audio */}
      <Section title="Audio">
        <SliderRow
          label="Microphone"
          icon={<MicIcon />}
          value={settings.microphoneGain}
          onChange={v => update('microphoneGain', v)}
        />
        <SliderRow
          label="Speaker Volume"
          icon={<SpeakerIcon />}
          value={settings.speakerVolume}
          onChange={v => update('speakerVolume', v)}
        />
      </Section>

      {/* About */}
      <Section title="About">
        <Row label="Version" value="1.0.1" icon={<InfoIcon />} />
        <Row label="Powered by" value="Twilio WebRTC" icon={<PhoneIcon />} />
        <Row label="Developer" value={"SM IBRAHIM"} />
      </Section>

      {/* Logout */}
      <div className="px-4 py-4 mt-2">
        <button
          onClick={onLogout}
          className="w-full py-3.5 rounded-2xl border border-[rgba(255,68,68,0.3)] bg-[rgba(255,68,68,0.08)] text-red-400 font-semibold text-sm hover:bg-[rgba(255,68,68,0.15)] transition-colors active:scale-95"
        >
          Sign Out
        </button>
      </div>
      <div className="h-4" />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-1">
      <p className="section-header">{title}</p>
      <div className="mx-4 bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl overflow-hidden divide-y divide-[#2a2a2a]">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, icon, control }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="w-8 h-8 rounded-xl bg-[#242424] flex items-center justify-center text-gray-400 flex-shrink-0">
        {icon}
      </span>
      <span className="flex-1 text-sm text-white">{label}</span>
      {value && <span className="text-sm text-gray-500">{value}</span>}
      {control}
    </div>
  );
}

function ToggleRow({ label, icon, value, onChange, danger }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className={`w-8 h-8 rounded-xl bg-[#242424] flex items-center justify-center flex-shrink-0 ${danger && value ? 'text-red-400' : 'text-gray-400'}`}>
        {icon}
      </span>
      <span className={`flex-1 text-sm ${danger && value ? 'text-red-400' : 'text-white'}`}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${value ? (danger ? 'bg-red-500' : 'bg-[#00ff88]') : 'bg-[#333]'
          }`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? 'translate-x-0.5' : '-translate-x-5'
          }`} />
      </button>
    </div>
  );
}

function SliderRow({ label, icon, value, onChange }) {
  return (
    <div className="px-4 py-3.5">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-8 h-8 rounded-xl bg-[#242424] flex items-center justify-center text-gray-400 flex-shrink-0">
          {icon}
        </span>
        <span className="flex-1 text-sm text-white">{label}</span>
        <span className="text-sm text-gray-500">{value}%</span>
      </div>
      <input
        type="range" min="0" max="100" value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-[#333] accent-[#00ff88]"
      />
    </div>
  );
}

// Icons
const UserIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const TagIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>;
const RefreshIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>;
const GlobeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>;
const BellIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>;
const SoundIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /></svg>;
const WaitIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const DNDIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>;
const MicIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /></svg>;
const SpeakerIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 010 7.07" /></svg>;
const InfoIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
const PhoneIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" /></svg>;
