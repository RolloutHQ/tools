import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
const jsonwebtoken = require('jsonwebtoken');

function genToken(userId: string) {
  const nowSecs = Math.round(new Date().valueOf() / 1000);

  return jsonwebtoken.sign(
    {
      iss: 'tools',
      sub: userId,
      iat: nowSecs,
      exp: nowSecs + 60 * 60,
    },
    process.env.ROLLOUT_CLIENT_SECRET,
    { algorithm: 'HS512' }
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const token = genToken(userId as string);

  return NextResponse.json({ token });
}
