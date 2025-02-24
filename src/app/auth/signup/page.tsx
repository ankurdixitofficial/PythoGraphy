import { headers } from 'next/headers';
import Layout from '@/components/Layout';
import SignUpForm from './SignUpForm';

export const dynamic = 'force-dynamic';

export default function SignUpPage() {
  // Force server-side rendering
  headers();

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>
        <SignUpForm />
      </div>
    </Layout>
  );
} 