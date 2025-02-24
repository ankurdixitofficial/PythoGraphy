import { headers } from 'next/headers';
import Layout from '@/components/Layout';
import ErrorContent from './ErrorContent';

export const dynamic = 'force-dynamic';

export default function AuthError() {
  // Force server-side rendering
  headers();
  
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <ErrorContent />
      </div>
    </Layout>
  );
} 