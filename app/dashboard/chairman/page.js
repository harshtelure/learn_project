'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ChairmanDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user data in cookies
    const userData = Cookies.get('user');
    const token = Cookies.get('token');

    if (!userData || !token) {
      console.log('No auth data found, redirecting to login');
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Verify the user has the correct role
      if (parsedUser.role?.toLowerCase() !== 'chairman') {
        console.log('Invalid role, redirecting to login');
        router.push('/login');
        return;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Chairman Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome, {user?.username}</p>
        </div>
      </div>
    </div>
  );
} 