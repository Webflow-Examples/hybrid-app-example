import { cookies } from 'next/headers';
import { getAPIClient } from '@/utils/webflow_helper'
import PageList from '@/components/page-list';

export default async function PageTab({ params: { id: siteId } }){
  const cookieStore = cookies();
  const webflowAuth = cookieStore.get('webflow_auth').value;
  const webflowAPI = getAPIClient(webflowAuth);
  const pages = await webflowAPI.pages({siteId});
  const plainPages = JSON.parse(JSON.stringify(pages)) || [];

  // TODO: Add pagination component: https://tailwindui.com/components/application-ui/navigation/pagination#component-f9a9347de5384a492c79c34cf6ce3ccf
  return (
    <div className="mt-4 flow-root">
      <PageList pages={plainPages} />
    </div>
  )
}