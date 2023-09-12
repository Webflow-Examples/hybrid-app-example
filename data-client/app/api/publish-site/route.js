import { cookies } from 'next/headers';
import { getAPIClient } from '@/utils/webflow_helper';

export async function POST(request) {
  const cookieStore = cookies();
  const webflowAuth = cookieStore.get('webflow_auth').value;
  const webflowAPI = getAPIClient(webflowAuth, false);

  const {siteId, domains} = await request.json();

  try {
    const response = await webflowAPI.publishSite({ siteId, domains});
    return Response.json(response);
  } catch (error) {
    if (error.message.includes('429')) {
      return Response.json({ error: 'You\'ve been recently published your site. Please wait 1 minute before publishing again.' });
    }
    return Response.json({ error: error.message });
  }
}
