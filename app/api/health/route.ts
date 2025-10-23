import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Test KV connection
    await kv.set('health-check', Date.now(), { ex: 60 });
    const value = await kv.get('health-check');

    return NextResponse.json({
      status: 'ok',
      kv: 'connected',
      timestamp: value,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      kv: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
