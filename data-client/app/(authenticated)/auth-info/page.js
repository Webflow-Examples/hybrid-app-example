import { cookies } from 'next/headers';

import { getAPIClient, getAuthUrl } from '@/utils/webflow_helper'
import { LogoutButton, ReauthorizeButton } from '@/components/buttons';

export default async function Home() {
  const cookieStore = cookies();
  const webflowAuth = cookieStore.get('webflow_auth').value;
  const webflowAPI = getAPIClient(webflowAuth);
  // const [user, info] = await Promise.all([webflowAPI.authenticatedUser(), webflowAPI.info()]);

  // const { rateLimit, workspaces, sites, application } = info;
  // const authLevel = workspaces.length > 0 ? 'Workspace' : sites.length > 0 ? 'Site' : 'User';
  // const { name, description, homepage } = application;
  // const { firstName, lastName, email } = user.user; // this feels like a bug somewhere.
  const url = getAuthUrl();
  return (
    <div className="flex flex-col space-y-4">
      {/* <Stats authLevel={authLevel} rateLimit={rateLimit} />
      <AppInfo name={name} description={description} homepage={homepage} />
      <UserInfo name={`${firstName} ${lastName}`} email={email} /> */}
      <div className="flex flex-row-reverse space-x-4 space-x-reverse">
        <ReauthorizeButton installUrl={url} />
        <LogoutButton />
      </div>
    </div>
  )
}

function UserInfo({name, email}) {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">User Info</h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{name}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{email}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

function AppInfo({name, description, homepage}) {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">App Info</h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{name}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Homepage</dt>
            <dd className="mt-1 text-sm text-gray-900">{homepage}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {description}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

function Stats({authLevel, rateLimit}) {
  const authLevelElement = (
    <div className="px-4 py-5 sm:p-6">
      <dt className="text-base font-normal text-gray-900">Authorization Level</dt>
      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
        <div className="flex items-baseline text-2xl font-semibold text-blue-600">
          {authLevel}
        </div>
      </dd>
    </div>
  );

  const rateLimitElement = (
    <div className="px-4 py-5 sm:p-6">
      <dt className="text-base font-normal text-gray-900">Rate Limit</dt>
      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
        <div className="flex items-baseline text-2xl font-semibold text-blue-600">
          {rateLimit}
          <span className="ml-2 text-sm font-medium text-gray-500">requests remaining</span>
        </div>
      </dd>
    </div>
  );

  return (
    <div>
      <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-2 md:divide-y-0 md:divide-x">
        {authLevelElement}
        {rateLimitElement}
      </dl>
    </div>
  )
}
