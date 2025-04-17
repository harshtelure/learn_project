'use client';

import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

export default function HODDashboard() {
  const { user } = useAuth();

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