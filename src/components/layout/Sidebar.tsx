import React from 'react';
import { Link } from 'react-router-dom';

// Icons would typically come from a library like heroicons
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const OrgIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const MonitoringIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const AutomationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IntegrationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
  </svg>
);

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive = false }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm rounded-lg ${
        isActive 
          ? 'bg-indigo-700 text-white' 
          : 'text-gray-300 hover:bg-indigo-600 hover:text-white'
      } transition-colors duration-200`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  // In a real app, you would determine the active state based on the current route
  // Using a variable of type string to avoid TypeScript comparison errors
  const activeRoute: string = '/';

  return (
    <div className="flex flex-col w-64 bg-indigo-800 text-white h-full">
      <div className="p-4 border-b border-indigo-700">
        <h1 className="text-2xl font-bold">Vibe Manager</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
        <NavItem 
          to="/" 
          icon={<DashboardIcon />} 
          label="Dashboard" 
          isActive={activeRoute === '/'} 
        />
        <NavItem 
          to="/organization" 
          icon={<OrgIcon />} 
          label="Organization" 
          isActive={activeRoute === '/organization'} 
        />
        <NavItem 
          to="/monitoring" 
          icon={<MonitoringIcon />} 
          label="Monitoring" 
          isActive={activeRoute === '/monitoring'} 
        />
        <NavItem 
          to="/automation" 
          icon={<AutomationIcon />} 
          label="Automation" 
          isActive={activeRoute === '/automation'} 
        />
        <NavItem 
          to="/integrations" 
          icon={<IntegrationIcon />} 
          label="Integrations" 
          isActive={activeRoute === '/integrations'} 
        />
      </div>
      
      <div className="p-4 border-t border-indigo-700">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-sm font-medium">UM</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">User Manager</p>
            <p className="text-xs text-indigo-300">View Profile</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
