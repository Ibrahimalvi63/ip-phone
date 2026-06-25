import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  const { username, password } = await request.json().catch(() => ({}));
  if (!username || !password)
    return NextResponse.json({ error: 'Credentials required' }, { status: 400 });

  const valid =
    username === (process.env.DEMO_USERNAME || 'admin') &&
    password === (process.env.DEMO_PASSWORD || 'changeme123');

  if (!valid) {
    await new Promise(r => setTimeout(r, 400)); // prevent brute-force
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign(
    { username, role: 'user' },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '8h' }
  );

  return NextResponse.json({ token, username, expiresIn: 28800 });
}
