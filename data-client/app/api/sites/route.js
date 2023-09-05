import { NextResponse } from 'next/server';
import { getAPIClient } from '@/utils/webflow_helper';

export async function GET(request) {
  const webflowAuth = request.nextUrl.searchParams.get('auth');
  const webflowAPI = getAPIClient(webflowAuth);
  const sites = await webflowAPI.sites();

  const CLIENT_URL = process.env.CLIENT_URL
  const allowedOrigins = [CLIENT_URL, 'http://localhost:1337',"https://webflow.com"];

  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    return NextResponse.json({ sites }, {
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } else {
    // Handle disallowed origin case
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

//   return NextResponse.json({ sites }, {
//     headers: {
//       'Access-Control-Allow-Origin': CLIENT_URL,
//       'Access-Control-Allow-Methods': 'GET',
//       'Access-Control-Allow-Headers': 'Content-Type',
//     },
//   });
// }