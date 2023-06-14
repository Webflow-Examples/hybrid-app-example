'use client';

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import useSWR from 'swr'

import { XMarkIcon, DocumentDuplicateIcon, InformationCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { getFunFact } from '../utils';

export function usePageInfo(pageId) {
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error, isLoading } = useSWR(`/api/page?id=${pageId}`, fetcher)
  return { page_info: data, isLoading, isError: error }
}

export function PageSlideOver({openPageId, setOpenPageId}) {
  const { page_info, isLoading, isError} = usePageInfo(openPageId);
  const [open, setOpen] = useState(true);

  const closeSlideOver = () => {
    setOpenPageId(null);
    setOpen(false);
  };

  const getPageDetails = () => {
    if (isError) return <div>failed to load</div>;
    if (isLoading)
    return (
      <div className="grid items-center justify-center h-screen min-h-full place-items-center py-24 px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <div className="text-xl">
            <span role="img" aria-label="sparkles">✨</span> {getFunFact()}
          </div>
          <div className="flex mt-4 flex-col items-center justify-center space-x-1">
            <div className="flex mt-4 space-x-2 animate-pulse">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );

    if (page_info) {
      return (
        <Fragment>
          {page_info.seo && <SeoDetails data={page_info.seo} />}
          {page_info.openGraph && (
            <OpenGraphDetails data={page_info.openGraph} />
          )}
          <PageDetails data={page_info} />
        </Fragment>
      );
    }
  };

  return (
    <SlideOver title={page_info ? page_info.title : "Loading page details"} open={open} closeSlideOver={closeSlideOver}>
      <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
        {getPageDetails()}
      </div>
    </SlideOver>
  );
}

function PageDetails({ data }) {
  return (
    <>
      {Object.entries(data).map(([key, value]) => {
        if (['title', 'seo', 'openGraph'].includes(key)) return null;
        if (['createdOn', 'lastUpdated'].includes(key)) {
          const date = new Date(value);
          value = date.toLocaleString();
        }
        return (
          <div key={key} className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor={key}
                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
              >
                {key}
              </label>
            </div>
            <div className="sm:col-span-2">
              <span
                id={key}
                className="block w-full rounded-md py-1.5 text-gray-900 sm:text-sm sm:leading-6"
              >
                {JSON.stringify(value)}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );  
}

function OpenGraphDetails({ data }) {
  return (
    <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
      <div>
        <label
          htmlFor="openGraph"
          className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
        >
          Open Graph
        </label>
      </div>
      <div className="sm:col-span-2">
        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label htmlFor='og-title' className="group block text-sm font-medium leading-6 text-gray-900">
              Title
              {data.titleCopied && (
                <>
                <DocumentDuplicateIcon className="h-4 w-4 text-gray-500 inline-flex ml-1 group" />
                <span className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md opacity-0 m-4 mx-auto">
                  &ldquo;titleCopied&ldquo; was set to true
                </span>
                </>
              )}
            </label>
            <span
              id='og-title'
              className="block w-full rounded-md py-1.5 text-gray-900 sm:text-sm sm:leading-6"
            >
              {JSON.stringify(data.title)}
            </span>

            {data.titleAnalysis && (
              <div className="rounded-md bg-blue-50 p-4 mt-2">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <LightBulbIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Insights and recommendations:</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p className="mb-2">{data.titleAnalysis}</p>
                      <p>{data.titleSuggestions}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Description */}
          <div className="space-y-1">
            <label htmlFor='og-description' className="group block text-sm font-medium leading-6 text-gray-900">
              Description
              {data.descriptionCopied && (
                <>
                <DocumentDuplicateIcon className="h-4 w-4 text-gray-500 inline-flex ml-1 group" />
                <span className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md opacity-0 m-4 mx-auto">
                  &ldquo;descriptionCopied&ldquo; was set to true
                </span>
                </>
              )}
            </label>
            <span
              id='og-description'
              className="block w-full rounded-md py-1.5 text-gray-900 sm:text-sm sm:leading-6"
            >
              {JSON.stringify(data.description)}
            </span>
            {data.descriptionAnalysis && (
              <div className="rounded-md bg-blue-50 p-4 mt-2">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <LightBulbIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Insights and recommendations:</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p className="mb-2">{data.descriptionAnalysis}</p>
                      <p>{data.descriptionSuggestions}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SeoDetails({ data }) {
  return (
    <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
      <div>
        <label
          htmlFor="seo"
          className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
        >
          SEO
        </label>
      </div>
      <div className="sm:col-span-2">
        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor='seo-title' className="block text-sm font-medium leading-6 text-gray-900">
              Title
            </label>
            <span
              id='seo-title'
              className="block w-full rounded-md py-1.5 text-gray-900 sm:text-sm sm:leading-6"
            >
              {JSON.stringify(data.title)}
            </span>
            {data.titleAnalysis && (
              <div className="rounded-md bg-blue-50 p-4 mt-2">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <LightBulbIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Insights and recommendations:</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p className="mb-2">{data.titleAnalysis}</p>
                      <p>{data.titleSuggestions}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <label htmlFor='seo-description' className="block text-sm font-medium leading-6 text-gray-900">
              Description
            </label>
            <span
              id='seo-description'
              className="block w-full rounded-md py-1.5 text-gray-900 sm:text-sm sm:leading-6"
            >
              {JSON.stringify(data.description)}
            </span>
            {data.descriptionAnalysis && (
              <div className="rounded-md bg-blue-50 p-4 mt-2">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <LightBulbIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Insights and recommendations:</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p className="mb-2">{data.descriptionAnalysis}</p>
                      <p>{data.descriptionSuggestions}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SlideOver({title, children, open, closeSlideOver}){
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => closeSlideOver()}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {/* Header */}
                    <div className="bg-gray-50 px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between space-x-3">
                        <div className="space-y-1">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            {title}
                          </Dialog.Title>
                        </div>
                        <div className="flex h-7 items-center">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Main */}
                    <div>
                      {children}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}