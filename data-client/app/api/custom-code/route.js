import { NextResponse } from 'next/server'
import { cookies } from 'next/headers';
import { getAPIClient } from '@/utils/webflow_helper';

export async function PUT(request) {
  const cookieStore = cookies();
  const webflowAuth = cookieStore.get('webflow_auth').value;
  const webflowAPI = getAPIClient(webflowAuth);
  const {siteId, code} = await request.json();
  try {
    const response = await webflowAPI.writeCustomCode({ siteId, code });
    return NextResponse.json({ data: response });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}

export async function DELETE(request) {
  const cookieStore = cookies();
  const webflowAuth = cookieStore.get('webflow_auth').value;
  const webflowAPI = getAPIClient(webflowAuth);
  const {siteId} = await request.json();
  try {
    const deleted = await webflowAPI.deleteCustomCode({ siteId });
    return NextResponse.json(deleted);
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}