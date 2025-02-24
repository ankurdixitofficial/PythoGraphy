import { headers } from 'next/headers';
import Layout from '@/components/Layout';
import SignInButton from './SignInButton';

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
          </div>
          <div className="mt-8 space-y-6">
            <div className="space-y-4">
              <SignInButton />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 