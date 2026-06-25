'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { addCallLog, findContactByNumber } from '../lib/storage';
import { Device } from '@twilio/voice-sdk';

export const CALL_STATE = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  RINGING: 'ringing',
  IN_CALL: 'in_call',
  ENDED: 'ended',
  ERROR: 'error',
};

export default function useTwilio(authToken) {
  const [deviceReady, setDeviceReady] = useState(false);
  const [deviceError, setDeviceError] = useState(null);
  const [callState, setCallState] = useState(CALL_STATE.IDLE);
  const [activeCall, setActiveCall] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [currentNumber, setCurrentNumber] = useState('');
  const [incomingCall, setIncomingCall] = useState(null);

  const deviceRef = useRef(null);
  const callRef = useRef(null);
  const timerRef = useRef(null);
  const callStart = useRef(null);
  const callLogData = useRef(null);

  useEffect(() => {
    if (!authToken) return
    initDevice()
  }, [authToken])

  const fetchToken = useCallback(async () => {
    const res = await fetch('/api/token', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Token fetch failed');
    const data = await res.json();
    return data.token;
  }, [authToken]);

  const initDevice = useCallback(async () => {
    try {
      const token = await fetchToken();

      if (deviceRef.current) {
        deviceRef.current.destroy();
        deviceRef.current = null;
      }

      const device = new Device(token, {
        codecPreferences: ['opus', 'pcmu'],
        fakeLocalDTMF: true,
        enableRingingState: true,
        debug: false,
      });

      device.on('registered', () => {
        console.log('Twilio Registered');
        setDeviceReady(true);
        setDeviceError(null);
      });

      device.on('registering', () => {
        console.log('Twilio Registering...');
      });

      device.on('unregistered', () => {
        console.log('Twilio unregistered');
      });

      device.on('ready', () => {
        console.log('Device ready');
        setDeviceReady(true);
        setDeviceError(null);
      });

      device.on('error', (err) => {
        console.error('Twilio error:', err);
        setDeviceError(err.message || 'Device error');
        setCallState(CALL_STATE.ERROR);
      });

      device.on('connect', (conn) => {
        console.log('Device connected');
        callRef.current = conn;
        setActiveCall(conn);
        setCallState(CALL_STATE.IN_CALL);
        setIsMuted(false);
        callStart.current = Date.now();
        timerRef.current = setInterval(() => {
          setCallDuration(Math.floor((Date.now() - callStart.current) / 1000));
        }, 1000);
        attachCallHandlers(conn);
      });

      device.on('disconnect', () => handleDisconnect());

      device.on('incoming', (conn) => {
        setIncomingCall(conn);
        setCallState(CALL_STATE.RINGING);
        conn.on('cancel', () => {
          setIncomingCall(null);
          setCallState(CALL_STATE.IDLE);
          const from = conn.parameters?.From || 'Unknown';
          addCallLog({ type: 'missed', number: from, name: findContactByNumber(from)?.name, duration: 0 });
        });
      });

      // Refresh token before expiry
      device.on('tokenWillExpire', async () => {
        try {
          const newToken = await fetchToken();
          device.updateToken(newToken);
        } catch (e) {
          console.error('Token refresh failed', e);
        }
      });

      device.register();
      deviceRef.current = device;
    } catch (err) {
      console.error('Device init error:', err);
      setDeviceError(err.message);
    }
  }, [fetchToken]);

  const attachCallHandlers = (conn) => {
    if (!conn || typeof conn.on !== 'function') {
      console.error('Invalid connection object:', conn);
      return;
    }
    conn.on('mute', (muted) => setIsMuted(muted));
    conn.on('disconnect', () => handleDisconnect());
    conn.on('reject', () => handleDisconnect());
  };

  const handleDisconnect = () => {
    clearInterval(timerRef.current);
    const duration = callStart.current
      ? Math.floor((Date.now() - callStart.current) / 1000)
      : 0;

    if (callLogData.current) {
      addCallLog({ ...callLogData.current, duration });
      callLogData.current = null;
    }

    setActiveCall(null);
    callRef.current = null;
    callStart.current = null;
    setCallState(CALL_STATE.ENDED);
    setCallDuration(0);
    setIsMuted(false);
    setCurrentNumber('');

    setTimeout(() => setCallState(CALL_STATE.IDLE), 2000);
  };

  // ─── Actions ───────────────────────────────────────────────────────────────
  const makeCall = useCallback(async (number) => {
    if (!deviceRef.current || !deviceReady) {
      setDeviceError('Device not ready');
      return;
    }
    const cleaned = number.replace(/[\s\-()]/g, '');
    if (!cleaned) return;

    setCurrentNumber(cleaned);
    setCallState(CALL_STATE.CONNECTING);
    setCallDuration(0);

    const contact = findContactByNumber(cleaned);
    callLogData.current = {
      type: 'outgoing',
      number: cleaned,
      name: contact?.name || null,
    };

    const params = { To: cleaned };
    const conn = await deviceRef.current.connect({ params });
    if (conn) {
      attachCallHandlers(conn);
    }
  }, [deviceReady]);

  const hangUp = useCallback(() => {
    if (callRef.current) {
      callRef.current.disconnect();
    } else if (deviceRef.current) {
      deviceRef.current.disconnectAll();
    }
    clearInterval(timerRef.current);
    handleDisconnect();
  }, []);

  const acceptIncoming = useCallback(() => {
    if (!incomingCall) return;
    const from = incomingCall.parameters?.From || 'Unknown';
    const contact = findContactByNumber(from);

    setCurrentNumber(from);
    callLogData.current = { type: 'incoming', number: from, name: contact?.name || null };

    incomingCall.accept();
    callRef.current = incomingCall;
    setActiveCall(incomingCall);
    setIncomingCall(null);
    setCallState(CALL_STATE.IN_CALL);
    callStart.current = Date.now();
    timerRef.current = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - callStart.current) / 1000));
    }, 1000);
    attachCallHandlers(incomingCall);
  }, [incomingCall]);

  const rejectIncoming = useCallback(() => {
    if (incomingCall) {
      incomingCall.reject();
      const from = incomingCall.parameters?.From || 'Unknown';
      addCallLog({ type: 'missed', number: from, name: findContactByNumber(from)?.name, duration: 0 });
    }
    setIncomingCall(null);
    setCallState(CALL_STATE.IDLE);
  }, [incomingCall]);

  const toggleMute = useCallback(() => {
    if (!callRef.current) return;
    const next = !isMuted;
    callRef.current.mute(next);
    setIsMuted(next);
  }, [isMuted]);

  const toggleSpeaker = useCallback(() => {
    setIsSpeaker(v => !v);
    // Note: browser speaker selection requires Web Audio API + user permission
  }, []);

  const sendDTMF = useCallback((digit) => {
    if (callRef.current) callRef.current.sendDigits(digit);
  }, []);

  const destroyDevice = useCallback(() => {
    clearInterval(timerRef.current);
    if (deviceRef.current) {
      deviceRef.current.destroy();
      deviceRef.current = null;
    }
    setDeviceReady(false);
  }, []);

  useEffect(() => () => destroyDevice(), []);

  return {
    deviceReady, deviceError, callState, activeCall,
    isMuted, isSpeaker, callDuration, currentNumber,
    incomingCall,
    makeCall, hangUp, acceptIncoming, rejectIncoming,
    toggleMute, toggleSpeaker, sendDTMF, destroyDevice,
    reinitDevice: initDevice,
  };
}
