import { NextResponse } from 'next/server';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';

const { AccessToken } = twilio.jwt;
const { VoiceGrant } = AccessToken;

export async function POST(request) {
  const auth = request.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    jwt.verify(auth.slice(7), process.env.JWT_SECRET);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_API_KEY, TWILIO_API_SECRET, TWILIO_TWIML_APP_SID } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_TWIML_APP_SID) {
    return NextResponse.json({ error: 'Twilio not configured' }, { status: 500 });
  }

  // Prefer API Key+Secret; fall back to Account SID+Auth Token
  const apiKey    = TWILIO_API_KEY    || TWILIO_ACCOUNT_SID;
  const apiSecret = TWILIO_API_SECRET || TWILIO_AUTH_TOKEN;

  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: TWILIO_TWIML_APP_SID,
    incomingAllow: true,
  });

  const accessToken = new AccessToken(TWILIO_ACCOUNT_SID, apiKey, apiSecret, {
    identity: 'ip-phone-user',
    ttl: 3600,
  });
  accessToken.addGrant(voiceGrant);

  return NextResponse.json({ token: accessToken.toJwt() });
}
