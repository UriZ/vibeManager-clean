import React from 'react';

const Monitoring: React.FC = () => {
  return (
    <div style={{ background: '#f3f4f6', minHeight: '100vh', padding: '20px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Monitoring</h1>
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Status Monitoring & Summaries</h2>
          <p style={{ color: '#4b5563', marginBottom: '16px' }}>This section will provide tools for team progress tracking, risk identification, email filtering, and event tracking.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '32px' }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ fontWeight: '500', fontSize: '18px', marginBottom: '8px' }}>Team Progress</h3>
              <p style={{ color: '#4b5563', fontSize: '14px' }}>Track team progress across various projects and initiatives.</p>
              <div style={{ height: '256px', background: '#f3f4f6', borderRadius: '8px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#6b7280' }}>Progress Dashboard Coming Soon</p>
              </div>
            </div>
            
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ fontWeight: '500', fontSize: '18px', marginBottom: '8px' }}>Risk Monitoring</h3>
              <p style={{ color: '#4b5563', fontSize: '14px' }}>Identify and track potential risks to project success.</p>
              <div style={{ height: '256px', background: '#f3f4f6', borderRadius: '8px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#6b7280' }}>Risk Dashboard Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
