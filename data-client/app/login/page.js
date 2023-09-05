import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import { getAuthUrl } from '@/utils/webflow_helper';
import Image from 'next/image';
import logo from '@/public/logo.svg';
import Link from 'next/link';

export default function Login() {
    return (
        <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-lg w-full space-y-8 bg-white shadow p-6 rounded-lg">
                <div className="text-center">
                    <Image
                    className="mx-auto h-12 w-auto"
                    src={logo}
                    alt="Devflow.party logo"
                    />
                    <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
                    Login with your Webflow account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        This is a demo app that explores the possibilities of what you could build with the Webflow API. 
                    </p>
                </div>
                <div className="mt-8 space-y-6">
                    <Link
                    href={getAuthUrl()}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <LockClosedIcon className="h-5 w-5 text-blue-400 group-hover:text-blue-300" aria-hidden="true" />
                    </span>
                    Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
