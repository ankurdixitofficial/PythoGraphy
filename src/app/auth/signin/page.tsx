import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const SignInClient = dynamic(() => import('./SignInClient'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8">
          <div className="w-full h-12 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  ),
  ssr: false
});

export default function SignInPage() {
  return (
    <Suspense>
      <SignInClient />
    </Suspense>
  );
} 