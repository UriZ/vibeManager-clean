import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SimpleNavigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/organization', label: 'Organization' },
    { path: '/monitoring', label: 'Monitoring' },
    { path: '/automation', label: 'Automation' },
    { path: '/integrations', label: 'Integrations' }
  ];

  return (
    <nav style={{ 
      background: '#4f46e5', 
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ 
        fontSize: '20px', 
        fontWeight: 'bold', 
        color: 'white' 
      }}>
        Vibe Manager
      </div>
      
      <div style={{ display: 'flex', gap: '24px' }}>
        {navItems.map(item => (
          <Link 
            key={item.path}
            to={item.path}
            style={{ 
              color: currentPath === item.path ? 'white' : 'rgba(255, 255, 255, 0.7)',
              textDecoration: 'none',
              fontWeight: currentPath === item.path ? 'bold' : 'normal',
              padding: '8px 0',
              borderBottom: currentPath === item.path ? '2px solid white' : '2px solid transparent'
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
      
      <div style={{ 
        width: '32px', 
        height: '32px', 
        borderRadius: '50%', 
        background: 'white', 
        color: '#4f46e5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '14px'
      }}>
        UM
      </div>
    </nav>
  );
};

export default SimpleNavigation;
