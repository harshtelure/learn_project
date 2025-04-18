'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import DashboardLayout from '../../components/DashboardLayout';

export default function HodDashboard() {
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
      if (parsedUser.role?.toLowerCase() !== 'hod') {
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
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900">HOD Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome, {user?.username}</p>
            
            {/* Department Information */}
            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Department Information
              </h2>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Department:</span> {user?.department?.name || 'Not specified'}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Code:</span> {user?.department?.department_code || 'Not specified'}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">College:</span> {user?.college?.name || 'Not specified'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Question Papers
                </h2>
                <p className="text-gray-600 mb-4">
                  Review and approve question papers for your department
                </p>
                <a
                  href="/dashboard/hod/papers"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Review Papers
                </a>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Exams
                </h2>
                <p className="text-gray-600 mb-4">
                  Schedule and manage department exams
                </p>
                <a
                  href="/dashboard/hod/exams"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Manage Exams
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 