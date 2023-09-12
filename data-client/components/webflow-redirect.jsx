'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function WebflowRedirect() {
  const router = useRouter();
  const [checkAuth, setCheckAuth] = useState(false);
  const [showElement, setShowElement] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const authenticated = cookies.find(cookie => cookie.includes('authenticated='));
    if (authenticated && authenticated.split('=')[1] === 'true' && !checkAuth) {
      router.push('/');
    }
    setCheckAuth(true);

    const timeoutId = setTimeout(() => {
      setShowElement(true);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };

  }, [router, checkAuth]);

  const getWarning = () => {
    if (showElement && checkAuth) return (
      <div className="mb-6 text-lg">
        Not working? <a href="/login" className="text-blue-600 dark:text-blue-500 underline">Try again</a>
      </div>
    )
  }

  return (
    <div className="grid items-center justify-center h-screen min-h-full place-items-center py-24 px-6 sm:py-32 lg:px-8">
      <div className="text-center">
        <div className="flex flex-col items-center justify-center space-x-1">
          {getWarning()}
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Authorizing your Webflow account
          </h1>
          <div className="flex mt-6 space-x-2 animate-pulse">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}