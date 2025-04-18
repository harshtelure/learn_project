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
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          HOD Dashboard
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question Papers Overview */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Question Papers
            </h3>
            <p className="text-blue-700">
              Review and approve question papers for your department
            </p>
            <a
              href="/dashboard/hod/papers"
              className="mt-4 inline-block text-blue-600 hover:text-blue-900"
            >
              Review Papers →
            </a>
          </div>

          {/* Exams Overview */}
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              Exams
            </h3>
            <p className="text-yellow-700">
              Schedule and manage department exams
            </p>
            <a
              href="/dashboard/hod/exams"
              className="mt-4 inline-block text-yellow-600 hover:text-yellow-900"
            >
              Manage Exams →
            </a>
          </div>
        </div>

        {/* Department Information */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Department Information
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <span className="font-medium">Department:</span> {user?.department?.name}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Code:</span> {user?.department?.department_code}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">College:</span> {user?.college?.name}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Stats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border rounded-lg p-4">
              <p className="text-sm text-gray-500">Pending Reviews</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <p className="text-sm text-gray-500">Upcoming Exams</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <p className="text-sm text-gray-500">Total Papers</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 