'use client';

import { useRouter } from 'next/navigation';
import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline'

export function client_side_logout(router, redirect_to = '/login') {
  fetch('/api/logout', { method: 'POST' })
  .then(response => {
    if (response.ok) {
      router.push(redirect_to);
    } else {
      throw new Error('Logout failed');
    }
  })
  .catch(error => {
    console.error('Error logging out', error);
  });
}

export function delete_auth_cookie() {
  document.cookie = 'authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
}

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="inline-flex items-center rounded-md border border-transparent bg-red-700 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
      onClick={() => {delete_auth_cookie(); client_side_logout(router)}}
    >
      <TrashIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
      Logout
    </button>
  );
}

export function ReauthorizeButton({installUrl}) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="inline-flex items-center rounded-md border border-transparent bg-blue-700 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      onClick={() => {delete_auth_cookie(); client_side_logout(router, installUrl)}}
    >
      <ArrowPathIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
      Reauthorize
    </button>
  );
}