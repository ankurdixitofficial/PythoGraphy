'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ErrorMessageContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Please contact support.';
      case 'AccessDenied':
        return 'Access was denied to your account. Please try again.';
      case 'Verification':
        return 'The verification link was invalid or has expired. Please try again.';
      default:
        return 'An error occurred during authentication. Please try again.';
    }
  };

  return (
    <div className="max-w-md w-full text-center">
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Authentication Error
        </h2>
        <p className="text-gray-600 mb-6">
          {error ? getErrorMessage(error) : 'An unknown error occurred.'}
        </p>
        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="block w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorMessage() {
  return (
    <Suspense fallback={
      <div className="max-w-md w-full text-center">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <ErrorMessageContent />
    </Suspense>
  );
}

export default function ErrorContent() {
  return <ErrorMessage />;
} 