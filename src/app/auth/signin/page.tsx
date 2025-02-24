import { Suspense } from 'react';
import { headers } from 'next/headers';
import Layout from '@/components/Layout';
import SignInButton from './SignInButton';

export const dynamic = 'force-dynamic';

function SignInContent() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <Suspense fallback={
              <div className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gray-800">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              <SignInButton />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  // Force server-side rendering
  headers();

  return (
    <Layout>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <SignInContent />
      </Suspense>
    </Layout>
  );
} 