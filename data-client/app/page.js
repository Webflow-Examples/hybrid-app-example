'use client';
import React, { useState, useEffect } from 'react';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

const Splash = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.includes('webflow_auth='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : null;
    setToken(token);
  }, []);

  const copyToClipboard = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="max-w-sm w-full sm:w-1/2 lg:w-1/3 py-6 px-3">
        <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col items-center text-center">
          <div className="mb-6">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22V16m0-6a2 2 0 00-2-2V6a2 2 0 014 0v2a2 2 0 00-2 2v6m6 6v-2a2 2 0 00-2-2h-4a2 2 0 00-2 2v2h8z"></path></svg>
          </div>
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-700 mb-2">Welcome to Devflow.party!</h1>
            <p className="text-gray-700 mb-2">You have successfully authenticated.</p>
            {token ? (
              <>
              <p className="text-gray-700 mb-2">
                {isCopied ? 'Copied!' : 'Copy Your Token '}
                <button onClick={copyToClipboard}  className="text-gray-700">
                  <ClipboardDocumentIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                </button>
              </p>
              <p className='text-gray-700 break-all'>
                {token}
              </p>
              </>
            ) : (
              <p className="text-gray-700">Something went wrong. No auth token was found.</p>
            )
            }
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-500">Open Webflow to get started with Devflow.party&apos;s Image Generator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splash;

