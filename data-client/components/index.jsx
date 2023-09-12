'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {ChevronDownIcon, ChevronUpIcon, ArrowTopRightOnSquareIcon, BellAlertIcon, XMarkIcon, BuildingStorefrontIcon, UserGroupIcon, CircleStackIcon, CodeBracketIcon, DocumentDuplicateIcon, CheckCircleIcon, TrashIcon, MegaphoneIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { Fragment, useState, useEffect } from 'react';
import { Popover, Transition } from '@headlessui/react';

import { classNames, formatDomainName } from '@/utils';

export function Tab({type, siteId}) {
  const getTabData = () => {
    switch (type) {
      case 'pages':
        return { name: 'Pages', href: `/site/${siteId}/pages`, icon: DocumentDuplicateIcon, disabled: false };
      case 'custom-code':
        return { name: 'Custom Code', href: `/site/${siteId}/custom-code`, icon: CodeBracketIcon, disabled: false };
      case 'webhooks':
        return { name: 'Webhooks', href: `/site/${siteId}/webhooks`, icon: BellAlertIcon, disabled: true };
      case 'cms':
        return { name: 'CMS', href: `/site/${siteId}/cms`, icon: CircleStackIcon, disabled: true };
      case 'ecommerce':
        return { name: 'Ecommerce', href: `/site/${siteId}/ecommerce`, icon: BuildingStorefrontIcon, disabled: true };
      default:
        return { name: 'Memberships', href: `/site/${siteId}/memberships`, icon: UserGroupIcon, disabled: true };
    }
  };

  const current_path = usePathname();
  const tab_data = getTabData();
  const current = current_path.includes(tab_data.href);
  return (
    <Link
    key={tab_data.name}
    href={tab_data.disabled ? '/' : tab_data.href}
    className={classNames(
      current
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500',
        tab_data.disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:border-blue-600 hover:text-blue-600',
      'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium'
    )}
    aria-current={current ? 'page' : undefined}
  >
    <tab_data.icon
      className={classNames(
        current ? 'text-blue-600' : 'text-gray-400',
        tab_data.disabled ? '' : 'group-hover:text-blue-600',
        '-ml-0.5 mr-2 h-5 w-5'
      )}
      aria-hidden="true"
    />
    <span>{tab_data.name}</span>
  </Link>
  )    
}

export function Banner({Icon, content, handleClose, color}){
  const colorClasses = {
    red: {
      container: 'bg-red-50',
      icon: 'text-red-500',
      text: 'text-red-800',
      button: 'text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50',
    },
    green: {
      container: 'bg-green-50',
      icon: 'text-green-500',
      text: 'text-green-800',
      button: 'text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50',
    },
  };
  const classes = colorClasses[color];
  
  return (
    <div className={`rounded-md ml-20 p-4 fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-8 z-50 ${classes.container}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-6 w-6 ${classes.icon}`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${classes.text}`}>{content}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={handleClose}
              className={`inline-flex rounded-md p-1.5 ${classes.button} focus:outline-none focus:ring-2`}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


export function PublishPopoverMenu({siteId, domains}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState([]);

  const isClientSide = () => typeof document !== 'undefined';

  const getCookie = (name) => {
    if (!isClientSide()) return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const getLastPublished = () => {
    const lastPublished = getCookie(`lastPublished-${siteId}`);
    return lastPublished ? new Date(lastPublished) : null;
  };

  const calculateTimeLeft = () => {
    const lastPublished = getLastPublished();
    if (!lastPublished) return 0;
  
    const timeElapsed = (Date.now() - lastPublished) / 1000;
    const remainingTime = 60 - timeElapsed;
    return remainingTime > 0 ? remainingTime : 0;
  };

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  const setCookie = (name, value, minutes) => {
    const expires = new Date(Date.now() + minutes * 60000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  };

  const canPublish = () => {
    const lastPublished = getLastPublished();
    if (!lastPublished) return true;

    const timeElapsed = (Date.now() - lastPublished) / 1000;
    return timeElapsed >= 60;
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    let timeout;
    if (showBanner) {
      timeout = setTimeout(() => {
        setShowBanner(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [showBanner]);

  const handleDomainToggle = (domain) => {
    setSelectedDomains((prevState) => {
      // Check if the domain is already in the selectedDomains array
      const index = prevState.indexOf(domain);
  
      // If the domain is in the array, remove it
      if (index !== -1) {
        return prevState.filter((d) => d !== domain);
      }
  
      // Otherwise, add the domain to the array
      return [...prevState, domain];
    });
  };

  const handlePopoverStateChange = () => {
    setPopoverOpen(!popoverOpen);
  };

  const handlePublish = async () => {
    if (selectedDomains.length > 0) {
      try {
        if (canPublish()) {
          const response = await fetch('/api/publish-site', {
            method: 'POST',
            body: JSON.stringify({ siteId, domains: selectedDomains }),
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const res = await response.json();
          if (res.queued) {
            setShowBanner(true);
            setPopoverOpen(false);
            setCookie(`lastPublished-${siteId}`, new Date().toISOString(), 60);
            setTimeLeft(60);
          }
        }
      } catch (error) {
        console.error('Error publishing site on server:', error);
      }
    }
  };

  const getPublishButton = () => {
    if (!canPublish()) {
      return (
        <button
          className="px-4 py-2 mr-2 bg-white text-gray-400 border-gray-300 border inline-flex items-center rounded-md text-sm font-semibold shadow-sm"
          disabled
        >
          {Math.round(timeLeft)} seconds
        </button>
      );
    }
    if (selectedDomains.length === 0) {
      return (
        <button
          className="px-4 py-2 mr-2 bg-white text-gray-400 border-gray-300 border inline-flex items-center rounded-md text-sm font-semibold shadow-sm"
          disabled
        >
          Publish
        </button>
      );
    }
    return (
      <button
        onClick={() => handlePublish()}
        className="px-4 py-2 mr-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500"
      >
        Publish
      </button>
    )
  }

  const getDomainLabel = (domainName) => (
    <label key={domainName} className="flex items-center space-x-3 cursor-pointer">
      <input
        type="checkbox"
        className="form-checkbox text-blue-600"
        checked={selectedDomains.includes(domainName)}
        onChange={() => handleDomainToggle(domainName)}
      />
      <span title={`https://${domainName}`}>{formatDomainName(domainName)}</span>
      <a
        href={`https://${domainName}`}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-1 inline-flex items-center text-blue-600 hover:text-blue-800"
      >
        <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
      </a>
    </label>
  );

  return (
    <>
    <Popover className="relative">
      <Popover.Button
        onClick={handlePopoverStateChange}
        className={`inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 ${
          domains.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={domains.length === 0}
      >
        <RocketLaunchIcon className="h-5 w-5" aria-hidden="true" />
        <span>Publish</span>
        {popoverOpen ? (
          <ChevronUpIcon className="h-3 w-3" aria-hidden="true" />
        ) : (
          <ChevronDownIcon className="h-3 w-3" aria-hidden="true" />
        )}
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute right-0 z-10 mt-5 flex w-screen max-w-max px-4">
          <div className="w-auto min-w-[200px] flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
            <div className="p-4">
              {domains.map((domain) => getDomainLabel(domain.name))}
            </div>
            <div className="flex justify-end p-2 bg-gray-50">
              {getPublishButton()}
              <button
                onClick={() => setSelectedDomains([])}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus
                focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
    {showBanner && <Banner Icon={RocketLaunchIcon} content="Your site(s) has been published!" color="green" handleClose={() => setShowBanner(false)} />}
    </>
  );
}
