'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';

export default function ChairmanDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('ChairmanDashboard - Auth state:', {
      isAuthenticated,
      userRole: user?.role,
      userData: user
    });

    // Check if user is authenticated and has chairman role
    if (!isAuthenticated || !user || user.role?.toLowerCase() !== 'chairman') {
      console.log('Redirecting to login - Auth check failed:', {
        isAuthenticated,
        userRole: user?.role,
        expectedRole: 'chairman'
      });
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  // Show loading state while checking authentication
  if (!user || user.role?.toLowerCase() !== 'chairman') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Chairman Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">Welcome, {user.username}</span>
              <button
                onClick={() => {
                  Cookies.remove('user');
                  Cookies.remove('token');
                  router.push('/login');
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Question Paper Management */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Question Paper Management
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Manage and review question papers</p>
                </div>
              </div>
            </div>

            {/* User Management */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  User Management
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Manage system users and roles</p>
                </div>
              </div>
            </div>

            {/* Reports */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Reports
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>View system reports and analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 