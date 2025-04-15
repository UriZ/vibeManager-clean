import React from 'react';
import CalendarAlerts from '../calendar/CalendarAlerts';

const SimpleDashboard: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Vibe Manager Dashboard</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <p>Welcome to Vibe Manager - your central command center for management activities.</p>
      </div>
      
      {/* Calendar Alerts */}
      <CalendarAlerts userId="user@example.com" />
      
      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>Team Members</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px' }}>12</p>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
            <span style={{ color: '#10b981', fontSize: '14px' }}>↑ 2</span>
            <span style={{ color: '#9ca3af', fontSize: '12px', marginLeft: '4px' }}>vs last week</span>
          </div>
        </div>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>Active Tasks</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px' }}>28</p>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
            <span style={{ color: '#ef4444', fontSize: '14px' }}>↓ 5</span>
            <span style={{ color: '#9ca3af', fontSize: '12px', marginLeft: '4px' }}>vs last week</span>
          </div>
        </div>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>Upcoming Meetings</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px' }}>8</p>
        </div>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>Pending Decisions</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px' }}>5</p>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
            <span style={{ color: '#10b981', fontSize: '14px' }}>↑ 2</span>
            <span style={{ color: '#9ca3af', fontSize: '12px', marginLeft: '4px' }}>vs last week</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Team Activity */}
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontWeight: 'bold' }}>Team Activity</h2>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                  AJ
                </div>
                <div>
                  <p style={{ fontSize: '14px' }}>
                    <span style={{ fontWeight: '500' }}>Alex Johnson</span>{' '}
                    <span>completed task</span>{' '}
                    <span style={{ fontWeight: '500' }}>Q1 Budget Review</span>
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>10 minutes ago</p>
                </div>
              </div>
            </div>
            
            <div style={{ paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                  SM
                </div>
                <div>
                  <p style={{ fontSize: '14px' }}>
                    <span style={{ fontWeight: '500' }}>Sarah Miller</span>{' '}
                    <span>commented on</span>{' '}
                    <span style={{ fontWeight: '500' }}>Project Roadmap</span>
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>30 minutes ago</p>
                </div>
              </div>
            </div>
            
            <div style={{ paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                  DC
                </div>
                <div>
                  <p style={{ fontSize: '14px' }}>
                    <span style={{ fontWeight: '500' }}>David Chen</span>{' '}
                    <span>scheduled meeting with</span>{' '}
                    <span style={{ fontWeight: '500' }}>Marketing Team</span>
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Autonomous Decisions */}
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontWeight: 'bold' }}>Autonomous Decisions</h2>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '16px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ fontWeight: '500' }}>Budget Approval</h3>
                <span style={{ fontSize: '12px', padding: '4px 8px', background: '#d1fae5', color: '#065f46', borderRadius: '9999px' }}>
                  approved
                </span>
              </div>
              <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px' }}>Office supplies request for $250</p>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>15 minutes ago</p>
            </div>
            
            <div style={{ marginBottom: '16px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ fontWeight: '500' }}>Meeting Rescheduled</h3>
                <span style={{ fontSize: '12px', padding: '4px 8px', background: '#d1fae5', color: '#065f46', borderRadius: '9999px' }}>
                  approved
                </span>
              </div>
              <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px' }}>Weekly team sync moved to Thursday</p>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>1 hour ago</p>
            </div>
            
            <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ fontWeight: '500' }}>New Hire Equipment</h3>
                <span style={{ fontSize: '12px', padding: '4px 8px', background: '#fef3c7', color: '#92400e', borderRadius: '9999px' }}>
                  pending
                </span>
              </div>
              <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px' }}>Laptop purchase for $1,800</p>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>2 hours ago</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SimpleDashboard;
