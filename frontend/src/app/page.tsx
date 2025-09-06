'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sticky Wall
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Organize your thoughts and tasks with beautiful sticky notes
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="block w-full bg-white text-indigo-600 py-3 px-4 rounded-lg font-medium border border-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            Create Account
          </Link>
        </div>
        
        <div className="mt-12 grid grid-cols-3 gap-4 opacity-60">
          <div className="bg-yellow-200 h-16 rounded-lg"></div>
          <div className="bg-blue-200 h-16 rounded-lg"></div>
          <div className="bg-pink-200 h-16 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
