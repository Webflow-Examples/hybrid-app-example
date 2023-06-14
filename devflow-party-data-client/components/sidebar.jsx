'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  ShieldCheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '@/utils';
import Image from 'next/image';
import logo from '@/public/logo.svg';
import { usePathname,  } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar({sites, children}){
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const current_path = usePathname();

  const getAuthNav = () => {
    const name = 'Authorization Info';
    const current = current_path.startsWith('/auth-info');
    return (
      <Link
      key="auth-info"
      href='/auth-info'
      className={classNames(
          current ? 'bg-gray-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600',
          'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
      )}
      >
      <ShieldCheckIcon
          className={classNames(
          current ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500',
          'mr-3 flex-shrink-0 h-6 w-6'
          )}
          aria-hidden="true"
      />
      {name}
      </Link>
    )
  }

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={() => setSidebarOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                  <div className="flex flex-shrink-0 items-center px-4">
                    <Image
                      className="mx-auto h-8 w-auto"
                      src={logo}
                      alt="Webflow"
                    />
                  </div>
                  <nav className="mt-5 space-y-1 px-2">
                      <div className="space-y-1">
                        {getAuthNav()}
                      </div>
                      {sites && sites.length > 0 &&
                        <div className="mt-4">
                          <h3 className="px-3 text-sm font-medium text-gray-500" id="projects-headline">
                            Sites
                          </h3>
                          <div className="space-y-1" role="group" aria-labelledby="projects-headline">
                            {sites.map((item) => (
                              <Link
                              key={item.id}
                              href={`/site/${item.id}`}
                              className={classNames(
                                current_path.startsWith(`/site/${item.id}`) ? "bg-gray-100 text-blue-600" : "text-gray-600",
                              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50 hover:text-blue-600"
                              )}
                              >
                              <span className="truncate">{item.displayName}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      }
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0">{/* Force sidebar to shrink to fit close icon */}</div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div id="static-sidebar" className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
                <Image
                className="mx-auto h-8 w-auto"
                src={logo}
                alt="Webflow"
                />
            </div>
            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
                <div className="space-y-1">
                    {getAuthNav()}
                </div>
                {sites && sites.length > 0 && 
                  <div className="space-y-1 pt-4">
                      <h3 className="px-3 text-sm font-medium text-gray-500" id="projects-headline">
                          Sites
                      </h3>
                      <div className="space-y-1" role="group" aria-labelledby="projects-headline">
                          {sites.map((item) => (
                          <Link
                          key={item.id}
                          href={`/site/${item.id}`}
                          className={classNames(
                            current_path.startsWith(`/site/${item.id}`) ? "bg-gray-100 text-blue-600" : "text-gray-600",
                          "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50 hover:text-blue-600"
                          )}
                          >
                          <span className="truncate">{item.displayName}</span>
                          </Link>
                          ))}
                      </div>
                  </div>
                }
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-full md:pl-64">
        <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1 m-4">
          {children}
        </main>
      </div>
    </>    
  )
}