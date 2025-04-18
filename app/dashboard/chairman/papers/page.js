'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import DashboardLayout from '../../../components/DashboardLayout';

export default function FinalizedPapers() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

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
    setPapers([
      {
        id: 1,
        title: 'Computer Science - Semester 1',
        department: 'Computer Science',
        subject: 'Data Structures',
        semester: '1',
        status: 'pending',
        submittedBy: 'Dr. John Doe',
        submittedDate: '2024-03-15',
      },
      {
        id: 2,
        title: 'Mathematics - Semester 2',
        department: 'Mathematics',
        subject: 'Calculus',
        semester: '2',
        status: 'approved',
        submittedBy: 'Dr. Jane Smith',
        submittedDate: '2024-03-14',
      },
    ]);

    setLoading(false);
  }, [router]);

  const handleApprove = async (paperId) => {
    // TODO: Implement API call to approve paper
    console.log('Approving paper:', paperId);
  };

  const handleReject = async (paperId) => {
    // TODO: Implement API call to reject paper
    console.log('Rejecting paper:', paperId);
  };

  const handlePreview = (paper) => {
    setSelectedPaper(paper);
    setShowPreview(true);
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Finalized Papers</h1>
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
                            onClick={() => handlePreview(paper)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Preview
                          </button>
                          {paper.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(paper.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(paper.id)}
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
        </div>

        {/* Preview Modal */}
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