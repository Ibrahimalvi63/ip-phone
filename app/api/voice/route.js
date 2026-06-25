import { NextResponse } from 'next/server';
import twilio from 'twilio';

const { VoiceResponse } = twilio.twiml;

export async function POST(request) {
  const formData = await request.formData();
  const to   = formData.get('To')   || '';
  const from = process.env.TWILIO_CALLER_ID || '';

  const twiml = new VoiceResponse();

  if (!to) { twiml.say('No destination.'); }
  else {
    const cleaned = to.replace(/[\s\-()]/g, '');
    const dial = twiml.dial({ callerId: from, timeout: 30, record: 'do-not-record' });
    dial.number(cleaned);
  }

  return new NextResponse(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' },
  });
}

export async function GET() {
  return new NextResponse('<Response></Response>', {
    headers: { 'Content-Type': 'text/xml' },
  });
}
