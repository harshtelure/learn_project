'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import DashboardLayout from '../../components/DashboardLayout';
import { fetchUserData, fetchDepartmentsByCollege, fetchHODsByCollege } from '../../utils/GlobalAPI';

export default function ChairmanDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [papers, setPapers] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [departments, setDepartments] = useState([]);
  const [hods, setHods] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = Cookies.get('user');
        if (!userData) {
          router.push('/login');
          return;
        }

        const user = JSON.parse(userData);
        if (user.role?.toLowerCase() !== 'chairman') {
          router.push('/login');
          return;
        }

        setUser(user);

        // Fetch departments
        const departmentsResponse = await fetchDepartmentsByCollege(user.college);
        if (departmentsResponse.success) {
          setDepartments(departmentsResponse.departments);
        } else {
          console.error('Failed to fetch departments:', departmentsResponse.error);
        }

        // Fetch HODs
        const hodsResponse = await fetchHODsByCollege(user.college);
        if (hodsResponse.success) {
          setHods(hodsResponse.hods);
        } else {
          console.error('Failed to fetch HODs:', hodsResponse.error);
        }

        // Set mock data for papers and timetables
        setPapers(mockPapers);
        setTimetables(mockTimetables);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleApprovePaper = async (paperId) => {
    // TODO: Implement API call to approve paper
    console.log('Approving paper:', paperId);
  };

  const handleRejectPaper = async (paperId) => {
    // TODO: Implement API call to reject paper
    console.log('Rejecting paper:', paperId);
  };

  const handlePreviewPaper = (paper) => {
    setSelectedPaper(paper);
    setShowPreview(true);
  };

  const handleApproveTimetable = async (timetableId) => {
    // TODO: Implement API call to approve timetable
    console.log('Approving timetable:', timetableId);
  };

  const handleRescheduleTimetable = async (timetableId) => {
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
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Chairman Dashboard</h1>
                {user && (
                  <div className="mt-2">
                    <p className="text-gray-600">
                      <span className="font-medium">College:</span> {user.college}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Username:</span> {user.username}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user?.username}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your college departments, HODs, papers, and exam schedules
              </p>
            </div>

            {/* Departments Section */}
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Departments</h2>
                <button
                  onClick={() => router.push('/dashboard/chairman/departments')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Manage Departments
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-medium text-gray-900">{dept.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Code: {dept.code}</p>
                    <p className="text-sm text-gray-500">
                      HOD: {dept.hod || 'Not Assigned'}
                    </p>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-gray-500">
                        Faculty: {dept.totalFaculty}
                      </span>
                      <span className="text-gray-500">
                        Students: {dept.totalStudents}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Finalized Papers Section */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Finalized Papers</h2>
                <div className="flex space-x-4">
                  <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option value="all">All Departments</option>
                    <option value="cs">Computer Science</option>
                    <option value="math">Mathematics</option>
                  </select>
                  <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {papers.map((paper) => (
                    <li key={paper.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-lg font-medium text-indigo-600 truncate">
                              {paper.title}
                            </p>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <p className="mr-4">
                                <span className="font-medium">Department:</span> {paper.department}
                              </p>
                              <p className="mr-4">
                                <span className="font-medium">Subject:</span> {paper.subject}
                              </p>
                              <p>
                                <span className="font-medium">Semester:</span> {paper.semester}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              paper.status === 'approved' ? 'bg-green-100 text-green-800' :
                              paper.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {paper.status.charAt(0).toUpperCase() + paper.status.slice(1)}
                            </span>
                            <button
                              onClick={() => handlePreviewPaper(paper)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Preview
                            </button>
                            {paper.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprovePaper(paper.id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectPaper(paper.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Submitted by: {paper.submittedBy} on {paper.submittedDate}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Exam Timetable Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Exam Timetable</h2>
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
                                  onClick={() => handleApproveTimetable(timetable.id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRescheduleTimetable(timetable.id)}
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

        {/* Paper Preview Modal */}
        {showPreview && selectedPaper && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedPaper.title}</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Department</p>
                    <p>{selectedPaper.department}</p>
                  </div>
                  <div>
                    <p className="font-medium">Subject</p>
                    <p>{selectedPaper.subject}</p>
                  </div>
                  <div>
                    <p className="font-medium">Semester</p>
                    <p>{selectedPaper.semester}</p>
                  </div>
                  <div>
                    <p className="font-medium">Submitted By</p>
                    <p>{selectedPaper.submittedBy}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">Paper Content</h3>
                  {/* TODO: Add actual paper content preview */}
                  <div className="bg-gray-50 p-4 rounded">
                    <p>Paper content will be displayed here...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 