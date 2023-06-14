
import { cookies } from 'next/headers';
import Sidebar from '@/components/sidebar';
import { getAPIClient } from '@/utils/webflow_helper';

export default async function AuthenticatedLayout({ children }) {
  const cookieStore = cookies();
  const webflowAuth = cookieStore.get('webflow_auth').value;
  const webflowAPI = getAPIClient(webflowAuth);
  const sites = await webflowAPI.sites();
  // We can't pass an object that has non-serializable values such as functions, promises, or classes,
  // which can cause issues when trying to rehydrate the component on the client. e.g. the Sidebar.
  // Below we serialize and then deserialize the data, effectively creating a new plain object.
  // TODO: Find a better way to do this.
  const plainSites = JSON.parse(JSON.stringify(sites)) || [];
  return (
    <Sidebar sites={plainSites}>
      {children}
    </Sidebar>
  )
}