'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password: 'demo', // Demo password
        redirect: false,
      });

      if (result?.ok) {
        router.push('/dashboard');
      } else {
        alert('Sign in failed. Please try again.');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const demoSignIn = async (demoEmail: string) => {
    setEmail(demoEmail);
    setLoading(true);
    
    try {
      const result = await signIn('credentials', {
        email: demoEmail,
        password: 'demo',
        redirect: false,
      });

      if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Demo sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Image
            src="/hedgehox-logo.svg"
            alt="Hedgehox Logo"
            width={200}
            height={48}
            className="mx-auto mb-8"
          />
          <h2 className="text-3xl font-bold gradient-text">Welcome to FollowBoard</h2>
          <p className="mt-2 text-gray-600">
            Keep your founder updated without weekly sync meetings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input mt-1"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or try demo accounts</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => demoSignIn('wally@followboard.com')}
              disabled={loading}
              className="btn-outline"
            >
              <div className="text-xs">
                <div className="font-semibold">Contributor</div>
                <div className="text-gray-500">wally@followboard.com</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => demoSignIn('founder@followboard.com')}
              disabled={loading}
              className="btn-outline"
            >
              <div className="text-xs">
                <div className="font-semibold">Viewer (Founder)</div>
                <div className="text-gray-500">founder@followboard.com</div>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}