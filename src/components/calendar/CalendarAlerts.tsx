import React, { useEffect, useState } from 'react';
import { useLLMAgent } from '../../context/LLMAgentContext';
import { DailyInsights } from '../../mcp/calendar/models';

interface CalendarAlertsProps {
  userId: string;
  refreshInterval?: number; // in milliseconds
}

const CalendarAlerts: React.FC<CalendarAlertsProps> = ({ 
  userId, 
  refreshInterval = 5 * 60 * 1000 // Default: refresh every 5 minutes
}) => {
  const { 
    calendarAuthenticated,
    calendarAuthenticating,
    calendarError,
    calendarInsights,
    getCalendarAuthUrl,
    authenticateCalendar,
    refreshCalendarInsights
  } = useLLMAgent();
  
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Fetch calendar insights when authenticated
  useEffect(() => {
    if (calendarAuthenticated) {
      refreshCalendarInsights(userId);
      
      // Set up periodic refresh
      const interval = setInterval(() => refreshCalendarInsights(userId), refreshInterval);
      return () => clearInterval(interval);
    } else {
      setShowAuthPrompt(true);
    }
  }, [calendarAuthenticated, userId, refreshInterval]);

  const handleAuthClick = () => {
    // Open Google auth in a new window
    const authUrl = getCalendarAuthUrl();
    console.log('Opening auth URL:', authUrl);
    
    // Open in a popup window
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    
    const authWindow = window.open(
      authUrl,
      'googleAuthPopup',
      `width=${width},height=${height},left=${left},top=${top},toolbar=0,scrollbars=1,status=1,resizable=1`
    );
    
    if (!authWindow) {
      alert('Popup blocked! Please allow popups for this site to connect with Google Calendar.');
    }
  };

  if (showAuthPrompt) {
    return (
      <div className="calendar-auth-prompt" style={{ 
        padding: '20px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '16px' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto' }}>
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="#4f46e5" strokeWidth="2" />
            <path d="M3 10H21" stroke="#4f46e5" strokeWidth="2" />
            <path d="M16 2V6" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 2V6" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
          Connect Your Calendar
        </h3>
        <p style={{ color: '#4b5563', marginBottom: '20px', maxWidth: '400px', margin: '0 auto 20px' }}>
          Connect your Google Calendar to see upcoming meetings, get alerts about conflicts, and receive smart meeting preparation suggestions.
        </p>
        <button 
          onClick={handleAuthClick}
          style={{
            background: '#4f46e5',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            margin: '0 auto'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
            <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="white" strokeWidth="2" />
            <path d="M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Connect Google Calendar
        </button>
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '16px' }}>
          Your calendar data is securely processed and never shared with third parties.
        </p>
      </div>
    );
  }

  if (calendarAuthenticating) {
    return (
      <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', textAlign: 'center' }}>
        <div style={{ 
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #4f46e5',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        <p style={{ color: '#4b5563' }}>Loading calendar insights...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (calendarError) {
    return (
      <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
            <path d="M12 7V13" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="17" r="1" fill="#ef4444" />
          </svg>
          <p style={{ color: '#ef4444', fontWeight: '500' }}>Calendar Error</p>
        </div>
        <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '16px' }}>{calendarError}</p>
        <button 
          onClick={handleAuthClick}
          style={{
            background: '#f3f4f6',
            color: '#4b5563',
            border: '1px solid #d1d5db',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!calendarInsights) {
    return null;
  }

  return (
    <div style={{ 
      padding: '16px', 
      background: 'white', 
      borderRadius: '8px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      marginBottom: '20px'
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
        Calendar Alerts
      </h3>
      
      {/* Upcoming Meetings */}
      {calendarInsights.upcomingMeetings.length > 0 ? (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px', color: '#4b5563' }}>
            Upcoming Meetings
          </h4>
          <div>
            {calendarInsights.upcomingMeetings.map(meeting => (
              <div 
                key={meeting.id} 
                style={{ 
                  padding: '12px', 
                  borderRadius: '6px', 
                  background: '#f9fafb', 
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: '500' }}>{meeting.title}</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {meeting.needsPreparation && (
                  <span style={{ 
                    background: '#fef3c7', 
                    color: '#92400e', 
                    padding: '4px 8px', 
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    Prep Needed
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>No upcoming meetings today.</p>
      )}
      
      {/* Conflicts */}
      {calendarInsights.conflicts.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px', color: '#4b5563' }}>
            Schedule Conflicts
          </h4>
          <div>
            {calendarInsights.conflicts.map(conflict => (
              <div 
                key={conflict.id} 
                style={{ 
                  padding: '12px', 
                  borderRadius: '6px', 
                  background: '#fee2e2', 
                  marginBottom: '8px' 
                }}
              >
                <div style={{ fontWeight: '500', color: '#b91c1c', marginBottom: '4px' }}>
                  Conflict Detected
                </div>
                <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>
                  {conflict.description}
                </p>
                {conflict.suggestedResolution && (
                  <p style={{ fontSize: '14px', color: '#4b5563', fontStyle: 'italic' }}>
                    Suggestion: {conflict.suggestedResolution}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Recent Changes */}
      {calendarInsights.changes.length > 0 && (
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px', color: '#4b5563' }}>
            Recent Changes
          </h4>
          <div>
            {calendarInsights.changes.map(change => (
              <div 
                key={change.id} 
                style={{ 
                  padding: '12px', 
                  borderRadius: '6px', 
                  background: '#dbeafe', 
                  marginBottom: '8px' 
                }}
              >
                <p style={{ fontSize: '14px', color: '#1e40af' }}>
                  {change.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarAlerts;
