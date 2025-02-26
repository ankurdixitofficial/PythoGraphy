'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const name = formData.get('name') as string;

      // Validate input
      if (!email || !password || !name) {
        throw new Error('Please fill in all fields');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // First, create the account
      console.log('Attempting to create account...');
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name,
          email: email.toLowerCase(),
          password,
        }),
      });

      // Log response details for debugging
      console.log('Signup Response Status:', response.status);
      console.log('Signup Response Headers:', Object.fromEntries(response.headers.entries()));
      
      // Check content type
      const contentType = response.headers.get('content-type');
      console.log('Response Content-Type:', contentType);
      
      if (!contentType?.includes('application/json')) {
        console.error('Invalid content type received:', contentType);
        throw new Error('Server returned an invalid response type');
      }

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Response parsing error:', e);
        console.error('Non-JSON response received:', responseText);
        throw new Error('The server returned an invalid response format');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Then attempt to sign in
      console.log('Account created, attempting to sign in...');
      const signInResult = await signIn('credentials', {
        email: email.toLowerCase(),
        password,
        redirect: false,
        callbackUrl: '/'
      });

      console.log('SignIn Result:', signInResult);

      if (!signInResult) {
        throw new Error('No response from sign-in attempt');
      }

      if (signInResult.error) {
        console.error('Sign-in error:', signInResult.error);
        throw new Error(signInResult.error);
      }

      if (signInResult.ok) {
        console.log('Sign-in successful, redirecting...');
        router.push('/');
        router.refresh();
      } else {
        throw new Error('Sign-in failed');
      }
    } catch (error: any) {
      console.error('Full error details:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Must be at least 6 characters long
          </p>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Create account'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 