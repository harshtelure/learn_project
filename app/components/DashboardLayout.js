'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  const getRoleSpecificLinks = () => {
    const role = user.role_type.toLowerCase();
    const baseLinks = [
      { name: 'Dashboard', href: `/dashboard/${role}` },
    ];

    switch (role) {
      case 'chairman':
        return [
          ...baseLinks,
          { name: 'Departments', href: `/dashboard/${role}/departments` },
          { name: 'Users', href: `/dashboard/${role}/users` },
          { name: 'Question Papers', href: `/dashboard/${role}/papers` },
        ];
      case 'hod':
        return [
          ...baseLinks,
          { name: 'Question Papers', href: `/dashboard/${role}/papers` },
          { name: 'Exams', href: `/dashboard/${role}/exams` },
        ];
      case 'setter':
        return [
          ...baseLinks,
          { name: 'My Papers', href: `/dashboard/${role}/papers` },
        ];
      case 'coordinator':
        return [
          ...baseLinks,
          { name: 'Exams', href: `/dashboard/${role}/exams` },
          { name: 'Question Papers', href: `/dashboard/${role}/papers` },
        ];
      case 'center':
        return [
          ...baseLinks,
          { name: 'Exams', href: `/dashboard/${role}/exams` },
        ];
      default:
        return baseLinks;
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
                {getRoleSpecificLinks().map((link) => (
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