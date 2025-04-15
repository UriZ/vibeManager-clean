import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import components
import SimpleNavigation from './components/layout/SimpleNavigation';

// Import context providers
import { LLMAgentProvider } from './context/LLMAgentContext';

// Import pages
import Dashboard from './pages/Dashboard';
import Organization from './pages/Organization';
import Monitoring from './pages/Monitoring';
import Automation from './pages/Automation';
import Integrations from './pages/Integrations';
import GoogleAuthCallback from './pages/GoogleAuthCallback';

function App() {
  return (
    <LLMAgentProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <SimpleNavigation />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/organization" element={<Organization />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/automation" element={<Automation />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </LLMAgentProvider>
  );
}

export default App;
