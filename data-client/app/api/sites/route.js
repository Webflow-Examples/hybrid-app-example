import { NextResponse } from 'next/server';
import { getAPIClient } from '@/utils/webflow_helper';

export async function GET(request) {
  const webflowAuth = request.nextUrl.searchParams.get('auth');
  const webflowAPI = getAPIClient(webflowAuth);
  const sites = await webflowAPI.sites();

    return NextResponse.json({ sites }, {
      headers: {
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
