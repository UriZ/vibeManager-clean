import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLLMAgent } from '../context/LLMAgentContext';
import { debugLog, debugError, addToDebugOverlay, createDebugOverlay } from '../utils/debug';

const GoogleAuthCallback: React.FC = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState<string>('Processing authentication...');
  const [codeProcessed, setCodeProcessed] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticateCalendar } = useLLMAgent();

  useEffect(() => {
    // Create debug overlay
    createDebugOverlay();
    addToDebugOverlay('Google Auth Callback Page Loaded');
    
    // Check for a processed code flag in sessionStorage
    const processedCode = sessionStorage.getItem('processedAuthCode');
    const searchParams = new URLSearchParams(location.search);
    const currentCode = searchParams.get('code');
    
    const processAuth = async () => {
      // Prevent multiple processing of the same code
      if (codeProcessed || (processedCode && processedCode === currentCode)) {
        addToDebugOverlay('Code already processed, skipping');
        return;
      }
      
      try {
        // Extract the authorization code from the URL
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        
        debugLog('Auth callback parameters', { 
          hasCode: !!code, 
          codeLength: code?.length,
          error: error || 'none',
          fullUrl: window.location.href
        });
        
        if (error) {
          debugError('Google returned an error', error);
          addToDebugOverlay(`Google auth error: ${error}`);
          setStatus('error');
          setMessage(`Google authorization error: ${error}`);
          return;
        }
        
        if (!code) {
          debugError('No authorization code received', { search: location.search });
          addToDebugOverlay('No auth code in URL');
          setStatus('error');
          setMessage('No authorization code received from Google');
          return;
        }
        
        // Mark code as processed to prevent duplicate exchanges
        setCodeProcessed(true);
        
        // Store the code in sessionStorage to prevent reuse across page refreshes
        if (code) {
          sessionStorage.setItem('processedAuthCode', code);
        }
        
        // Exchange the code for tokens
        addToDebugOverlay(`Received auth code (${code.substring(0, 10)}...), exchanging for tokens`);
        const success = await authenticateCalendar(code);
        
        if (success) {
          debugLog('Authentication successful');
          addToDebugOverlay('Authentication successful!');
          setStatus('success');
          setMessage('Successfully authenticated with Google Calendar');
          
          // Clear the authorization code from the URL to prevent reuse
          window.history.replaceState({}, document.title, '/auth/google/callback');
          
          // Store authentication success in sessionStorage
          sessionStorage.setItem('calendarAuthSuccess', 'true');
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            addToDebugOverlay('Redirecting to dashboard...');
            navigate('/');
          }, 2000);
        } else {
          debugError('Authentication failed', { code: code.substring(0, 15) + '...' });
          addToDebugOverlay('Authentication failed');
          setStatus('error');
          setMessage('Failed to authenticate with Google Calendar');
        }
      } catch (error: any) {
        debugError('Exception during auth callback', error);
        addToDebugOverlay(`Auth callback error: ${error?.message || 'Unknown error'}`);
        setStatus('error');
        setMessage(`An error occurred during authentication: ${error?.message || 'Unknown error'}`);
      }
    };
    
    processAuth();
  }, [location, authenticateCalendar, navigate, codeProcessed]);
  
  // Clean up function to remove sessionStorage items when navigating away
  useEffect(() => {
    return () => {
      // Only clear if authentication was successful
      if (status === 'success') {
        sessionStorage.removeItem('processedAuthCode');
      }
    };
  }, [status]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '500px',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        background: 'white'
      }}>
        <h1 style={{ marginBottom: '20px', fontSize: '24px' }}>
          Google Calendar Authentication
        </h1>
        
        {status === 'processing' && (
          <div>
            <div style={{ 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #4f46e5',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 2s linear infinite',
              margin: '0 auto 20px'
            }} />
            <p>{message}</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <div style={{ 
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ color: '#10b981', fontWeight: '500' }}>{message}</p>
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#6b7280' }}>
              Redirecting to dashboard...
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <div style={{ 
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ color: '#ef4444', fontWeight: '500' }}>{message}</p>
            <button 
              onClick={() => navigate('/')}
              style={{
                marginTop: '20px',
                padding: '8px 16px',
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
