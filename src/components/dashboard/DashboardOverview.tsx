import React from 'react';

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-gray-400 text-xs ml-1">vs last week</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
          {icon}
        </div>
      </div>
    </div>
  );
};

// Activity Item Component
interface ActivityItemProps {
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ user, action, target, time }) => {
  return (
    <div className="flex items-start py-3">
      <div className="flex-shrink-0 mr-3">
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
          <span className="text-sm font-medium">{user.avatar}</span>
        </div>
      </div>
      <div>
        <p className="text-sm">
          <span className="font-medium text-gray-800">{user.name}</span>{' '}
          <span className="text-gray-600">{action}</span>{' '}
          <span className="font-medium text-gray-800">{target}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

// Task Item Component
interface TaskItemProps {
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

const TaskItem: React.FC<TaskItemProps> = ({ title, dueDate, priority, status }) => {
  const priorityClasses = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };
  
  const statusClasses = {
    'pending': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-indigo-100 text-indigo-800',
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <div className="flex space-x-2">
          <span className={`text-xs px-2 py-1 rounded-full ${priorityClasses[priority]}`}>
            {priority}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${statusClasses[status]}`}>
            {status}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">Due: {dueDate}</p>
    </div>
  );
};

// Decision Item Component
interface DecisionItemProps {
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  time: string;
}

const DecisionItem: React.FC<DecisionItemProps> = ({ title, description, status, time }) => {
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3">
      <div className="flex justify-between">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${statusClasses[status]}`}>
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
      <p className="text-xs text-gray-500 mt-2">{time}</p>
    </div>
  );
};

// Main Dashboard Component
const DashboardOverview: React.FC = () => {
  // Icons
  const TeamIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
  
  const TaskIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
  
  const MeetingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
  
  const DecisionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Team Members" 
          value="12" 
          icon={<TeamIcon />} 
          trend={{ value: "2", isPositive: true }} 
        />
        <StatsCard 
          title="Active Tasks" 
          value="28" 
          icon={<TaskIcon />} 
          trend={{ value: "5", isPositive: false }} 
        />
        <StatsCard 
          title="Upcoming Meetings" 
          value="8" 
          icon={<MeetingIcon />} 
        />
        <StatsCard 
          title="Pending Decisions" 
          value="5" 
          icon={<DecisionIcon />} 
          trend={{ value: "2", isPositive: true }} 
        />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Activity */}
        <div className="bg-white rounded-lg shadow col-span-2">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-800">Team Activity</h2>
          </div>
          <div className="p-6 divide-y divide-gray-200">
            <ActivityItem 
              user={{ name: "Alex Johnson", avatar: "AJ" }} 
              action="completed task" 
              target="Q1 Budget Review" 
              time="10 minutes ago" 
            />
            <ActivityItem 
              user={{ name: "Sarah Miller", avatar: "SM" }} 
              action="commented on" 
              target="Project Roadmap" 
              time="30 minutes ago" 
            />
            <ActivityItem 
              user={{ name: "David Chen", avatar: "DC" }} 
              action="scheduled meeting with" 
              target="Marketing Team" 
              time="1 hour ago" 
            />
            <ActivityItem 
              user={{ name: "Emily Taylor", avatar: "ET" }} 
              action="created document" 
              target="Q2 Strategy" 
              time="2 hours ago" 
            />
            <ActivityItem 
              user={{ name: "Michael Brown", avatar: "MB" }} 
              action="approved request from" 
              target="Finance Department" 
              time="3 hours ago" 
            />
          </div>
        </div>
        
        {/* Autonomous Decisions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-800">Autonomous Decisions</h2>
          </div>
          <div className="p-6 space-y-4">
            <DecisionItem 
              title="Budget Approval" 
              description="Office supplies request for $250" 
              status="approved" 
              time="15 minutes ago" 
            />
            <DecisionItem 
              title="Meeting Rescheduled" 
              description="Weekly team sync moved to Thursday" 
              status="approved" 
              time="1 hour ago" 
            />
            <DecisionItem 
              title="New Hire Equipment" 
              description="Laptop purchase for $1,800" 
              status="pending" 
              time="2 hours ago" 
            />
          </div>
        </div>
        
        {/* Tasks */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-800">Priority Tasks</h2>
          </div>
          <div className="p-6">
            <TaskItem 
              title="Prepare Q2 Review" 
              dueDate="Today" 
              priority="high" 
              status="in-progress" 
            />
            <TaskItem 
              title="Team 1:1 Meetings" 
              dueDate="Tomorrow" 
              priority="medium" 
              status="pending" 
            />
            <TaskItem 
              title="Update Department Budget" 
              dueDate="Apr 15" 
              priority="high" 
              status="pending" 
            />
            <TaskItem 
              title="Review Project Proposals" 
              dueDate="Apr 18" 
              priority="medium" 
              status="pending" 
            />
          </div>
        </div>
        
        {/* Calendar */}
        <div className="bg-white rounded-lg shadow col-span-2">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-800">Upcoming Events</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0 w-12 text-center">
                  <div className="font-bold text-indigo-600">10:00</div>
                  <div className="text-xs text-gray-500">AM</div>
                </div>
                <div className="ml-4 flex-1 bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-500">
                  <h3 className="font-medium text-indigo-800">Team Standup</h3>
                  <p className="text-sm text-indigo-600">30 min • Video Conference</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 w-12 text-center">
                  <div className="font-bold text-indigo-600">1:30</div>
                  <div className="text-xs text-gray-500">PM</div>
                </div>
                <div className="ml-4 flex-1 bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-medium text-green-800">1:1 with Sarah</h3>
                  <p className="text-sm text-green-600">45 min • Office</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 w-12 text-center">
                  <div className="font-bold text-indigo-600">3:00</div>
                  <div className="text-xs text-gray-500">PM</div>
                </div>
                <div className="ml-4 flex-1 bg-purple-50 p-3 rounded-lg border-l-4 border-purple-500">
                  <h3 className="font-medium text-purple-800">Q2 Planning</h3>
                  <p className="text-sm text-purple-600">1 hour • Conference Room A</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Risk Monitoring */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-800">Risk Monitoring</h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Project Alpha Timeline</span>
                <span className="text-sm font-medium text-red-600">High Risk</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">2 weeks behind schedule</p>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Team Capacity</span>
                <span className="text-sm font-medium text-yellow-600">Medium Risk</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Near maximum capacity</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Budget Utilization</span>
                <span className="text-sm font-medium text-green-600">Low Risk</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Under budget by 15%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
