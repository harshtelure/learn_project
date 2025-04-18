'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import DashboardLayout from '../../../components/DashboardLayout';

export default function ExamTimetable() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timetables, setTimetables] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');

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
      
      if (parsedUser.role?.toLowerCase() !== 'chairman') {
        router.push('/login');
        return;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
      return;
    }

    // TODO: Replace with actual API call
    // Mock data for now
    setTimetables([
      {
        id: 1,
        department: 'Computer Science',
        semester: '1',
        examDate: '2024-04-15',
        startTime: '09:00',
        endTime: '12:00',
        subject: 'Data Structures',
        venue: 'Room 101',
        status: 'scheduled',
      },
      {
        id: 2,
        department: 'Mathematics',
        semester: '2',
        examDate: '2024-04-16',
        startTime: '14:00',
        endTime: '17:00',
        subject: 'Calculus',
        venue: 'Room 102',
        status: 'scheduled',
      },
    ]);

    setLoading(false);
  }, [router]);

  const handleApprove = async (timetableId) => {
    // TODO: Implement API call to approve timetable
    console.log('Approving timetable:', timetableId);
  };

  const handleReschedule = async (timetableId) => {
    // TODO: Implement API call to reschedule timetable
    console.log('Rescheduling timetable:', timetableId);
  };

  const filteredTimetables = timetables.filter(timetable => {
    if (selectedDepartment !== 'all' && timetable.department !== selectedDepartment) {
      return false;
    }
    if (selectedSemester !== 'all' && timetable.semester !== selectedSemester) {
      return false;
    }
    return true;
  });

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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Exam Timetable</h1>
              <div className="flex space-x-4">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="all">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                </select>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="all">All Semesters</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                </select>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredTimetables.map((timetable) => (
                  <li key={timetable.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-medium text-indigo-600 truncate">
                            {timetable.subject}
                          </p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <p className="mr-4">
                              <span className="font-medium">Department:</span> {timetable.department}
                            </p>
                            <p className="mr-4">
                              <span className="font-medium">Semester:</span> {timetable.semester}
                            </p>
                            <p className="mr-4">
                              <span className="font-medium">Date:</span> {timetable.examDate}
                            </p>
                            <p>
                              <span className="font-medium">Time:</span> {timetable.startTime} - {timetable.endTime}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            timetable.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                            timetable.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {timetable.status.charAt(0).toUpperCase() + timetable.status.slice(1)}
                          </span>
                          {timetable.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(timetable.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReschedule(timetable.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Reschedule
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Venue: {timetable.venue}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 