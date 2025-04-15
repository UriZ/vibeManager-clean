import React, { useEffect } from 'react';
import SimpleDashboard from '../components/dashboard/SimpleDashboard';
import { createDebugOverlay, addToDebugOverlay } from '../utils/debug';
import { useLLMAgent } from '../context/LLMAgentContext';

const Dashboard: React.FC = () => {
  const { calendarAuthenticated, calendarError } = useLLMAgent();
  
  useEffect(() => {
    // Create debug overlay
    createDebugOverlay();
    addToDebugOverlay('Dashboard loaded');
    
    // Log calendar authentication status
    addToDebugOverlay(`Calendar auth status: ${calendarAuthenticated ? 'Authenticated' : 'Not authenticated'}`);
    if (calendarError) {
      addToDebugOverlay(`Calendar error: ${calendarError}`);
    }
  }, [calendarAuthenticated, calendarError]);
  
  return (
    <div style={{ background: '#f3f4f6', minHeight: '100vh' }}>
      <SimpleDashboard />
    </div>
  );
};

export default Dashboard;
