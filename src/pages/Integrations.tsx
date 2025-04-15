import React from 'react';

const Integrations: React.FC = () => {
  return (
    <div style={{ background: '#f3f4f6', minHeight: '100vh', padding: '20px' }}>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Integrations</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Integration Hub</h2>
          <p className="text-gray-600 mb-4">Manage connections with external systems and tools to maintain context across different platforms.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-lg">Calendar</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Integrate with calendar systems to manage meetings and events.</p>
              <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Connect
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-lg">Email</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Connect email accounts for communication management and automation.</p>
              <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Connect
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="font-medium text-lg">Task Management</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Integrate with task management tools to track and automate tasks.</p>
              <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Connect
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-lg">Budget/Finance</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Connect with financial systems for budget tracking and approvals.</p>
              <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Connect
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="font-medium text-lg">Git Repositories</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Integrate with Git repositories for code and project tracking.</p>
              <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Connect
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="font-medium text-lg">Communication</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Connect with communication platforms like Slack for team interactions.</p>
              <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Connect
              </button>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="font-medium text-lg mb-4">Plugin Management</h3>
            <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center h-48">
              <div className="text-center">
                <p className="text-gray-600 mb-3">Extend Vibe Manager with custom plugins</p>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Browse Plugin Marketplace
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
