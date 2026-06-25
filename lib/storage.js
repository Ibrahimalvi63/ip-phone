'use client';

// ─── Call Log ──────────────────────────────────────────────────────────────────
export function getCallLog() {
  try {
    return JSON.parse(localStorage.getItem('ip_call_log') || '[]');
  } catch { return []; }
}

export function addCallLog(entry) {
  // entry: { id, type ('outgoing'|'incoming'|'missed'), number, name, duration, timestamp }
  const log = getCallLog();
  const newEntry = { ...entry, id: Date.now().toString(), timestamp: new Date().toISOString() };
  const updated = [newEntry, ...log].slice(0, 100); // keep last 100
  localStorage.setItem('ip_call_log', JSON.stringify(updated));
  return newEntry;
}

export function clearCallLog() {
  localStorage.removeItem('ip_call_log');
}

export function deleteCallEntry(id) {
  const log = getCallLog().filter(e => e.id !== id);
  localStorage.setItem('ip_call_log', JSON.stringify(log));
}

// ─── Contacts ──────────────────────────────────────────────────────────────────
export function getContacts() {
  try {
    return JSON.parse(localStorage.getItem('ip_contacts') || '[]');
  } catch { return []; }
}

export function saveContact(contact) {
  const contacts = getContacts();
  if (contact.id) {
    const idx = contacts.findIndex(c => c.id === contact.id);
    if (idx !== -1) {
      contacts[idx] = contact;
    } else {
      contacts.push(contact);
    }
  } else {
    contacts.push({ ...contact, id: Date.now().toString(), createdAt: new Date().toISOString() });
  }
  contacts.sort((a, b) => a.name.localeCompare(b.name));
  localStorage.setItem('ip_contacts', JSON.stringify(contacts));
  return contacts;
}

export function deleteContact(id) {
  const contacts = getContacts().filter(c => c.id !== id);
  localStorage.setItem('ip_contacts', JSON.stringify(contacts));
  return contacts;
}

export function findContactByNumber(number) {
  const clean = number.replace(/[\s\-()]/g, '');
  return getContacts().find(c => c.phone.replace(/[\s\-()]/g, '') === clean) || null;
}

// ─── Settings ──────────────────────────────────────────────────────────────────
const DEFAULTS = {
  countryCode: '+880',
  ringtone: true,
  keypadClick: true,
  microphoneGain: 100,
  speakerVolume: 100,
  callWaiting: false,
  doNotDisturb: false,
  displayName: 'IP Phone User',
};

export function getSettings() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('ip_settings') || '{}') };
  } catch { return DEFAULTS; }
}

export function saveSettings(partial) {
  const current = getSettings();
  const updated = { ...current, ...partial };
  localStorage.setItem('ip_settings', JSON.stringify(updated));
  return updated;
}

// ─── Auth ──────────────────────────────────────────────────────────────────────
export function getAuthToken() {
  try {
    const token = localStorage.getItem('ip_token');
    const expiry = localStorage.getItem('ip_expiry');
    if (token && expiry && Date.now() < parseInt(expiry)) return token;
    clearAuth();
    return null;
  } catch { return null; }
}

export function setAuth(token, username, expiresIn) {
  localStorage.setItem('ip_token', token);
  localStorage.setItem('ip_user', username);
  localStorage.setItem('ip_expiry', (Date.now() + expiresIn * 1000).toString());
}

export function getAuthUser() {
  try { return localStorage.getItem('ip_user') || ''; } catch { return ''; }
}

export function clearAuth() {
  ['ip_token', 'ip_user', 'ip_expiry'].forEach(k => localStorage.removeItem(k));
}
