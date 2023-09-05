import { cookies } from 'next/headers';
import { getAPIClient } from '@/utils/webflow_helper'
import CustomCode from '@/components/custom-code';

export default async function CustomCodeTab({ params: { id: siteId } }) {
  const cookieStore = cookies();
  const webflowAuth = cookieStore.get('webflow_auth').value;
  const webflowAPI = getAPIClient(webflowAuth);
  let savedCode = null;
  try {
    savedCode = await webflowAPI.getCustomCode({siteId});
  } catch(e) {}
  
  return <CustomCode savedCode={savedCode} siteId={siteId} />;
}
