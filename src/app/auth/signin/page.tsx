import { Suspense } from 'react';
import { headers } from 'next/headers';
import Layout from '@/components/Layout';
import SignInForm from './SignInForm';

export const dynamic = 'force-dynamic';

export default function SignInPage() {
  // Force server-side rendering
  headers();

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <a href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                create a new account
              </a>
            </p>
          </div>
          <Suspense
            fallback={
              <div className="w-full flex items-center justify-center p-4">
                <div className="w-6 h-6 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <SignInForm />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
} 