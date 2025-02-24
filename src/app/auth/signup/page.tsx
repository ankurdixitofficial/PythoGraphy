import { Suspense } from 'react';
import { headers } from 'next/headers';
import Layout from '@/components/Layout';
import SignUpForm from './SignUpForm';

export const dynamic = 'force-dynamic';

export default function SignUpPage() {
  // Force server-side rendering
  headers();

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
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
            <SignUpForm />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
} 