import { NextResponse } from 'next/server'
import { cookies } from 'next/headers';
import { getAPIClient } from '@/utils/webflow_helper';

const { CLIENT_ID, CLIENT_SECRET } = process.env;

export async function POST(request) {
  const cookieStore = cookies();
  if (!cookieStore.has('webflow_auth')) {
    return NextResponse.json({ok: true});
  }
  const webflowAuth = cookieStore.get('webflow_auth').value;
  const webflowAPI = getAPIClient(webflowAuth, false);
  const res = await webflowAPI.revokeToken({access_token: webflowAuth, client_id: CLIENT_ID, client_secret: CLIENT_SECRET });  
  const response = NextResponse.json(res);
  response.cookies.delete('webflow_auth')
  return response;
}