import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAPIClient, getAuthUrl } from '@/utils/webflow_helper';

export async function GET(req) {
  const origin = req.headers.get('origin');
  let body;
  const cookieStore = cookies();
  const webflowAuthCookie = cookieStore.get('webflow_auth');
  const webflowAuth = webflowAuthCookie ? webflowAuthCookie.value : undefined;

  if (!webflowAuth) {
    body = {msg: 'Not authenticated', authUrl: getAuthUrl()};
  } else {
    const webflowAPI = getAPIClient(webflowAuth);
    res = await webflowAPI.authenticatedUser();
    body = {user: res};
  }

  return NextResponse.json(body, {
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}