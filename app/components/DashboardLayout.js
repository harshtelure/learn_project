'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = Cookies.get('user');
    const token = Cookies.get('token');

    if (!userData || !token) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
      return;
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('user', { path: '/' });
    Cookies.remove('token', { path: '/' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getRoleSpecificLinks = (user) => {
    if (!user) return [];
    
    const role = user.role?.toLowerCase();
    
    switch (role) {
      case 'hod':
        return [
          { name: 'Question Papers', href: '/dashboard/hod/papers' },
          { name: 'Exams', href: '/dashboard/hod/exams' },
          { name: 'Faculty', href: '/dashboard/hod/faculty' },
        ];
      case 'chairman':
        return [
          { name: 'Departments', href: '/dashboard/chairman/departments' },
          { name: 'HODs', href: '/dashboard/chairman/hods' },
          { name: 'Reports', href: '/dashboard/chairman/reports' },
        ];
      case 'faculty':
        return [
          { name: 'Question Papers', href: '/dashboard/faculty/papers' },
          { name: 'Exams', href: '/dashboard/faculty/exams' },
          { name: 'Profile', href: '/dashboard/faculty/profile' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  Question Paper Management
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {getRoleSpecificLinks(user).map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">
                    {user.name} ({user.role_type})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 