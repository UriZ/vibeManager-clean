/**
 * OAuth Configuration
 * 
 * This file contains configuration for OAuth providers used in the application.
 * In a production environment, these values should be stored in environment variables.
 */

// IMPORTANT: These values MUST be provided via environment variables
// See README.md for instructions on setting up OAuth credentials
export const googleOAuthConfig = {
  // Never hardcode OAuth credentials - use environment variables
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'PLACEHOLDER_CLIENT_ID',
  clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET || 'PLACEHOLDER_CLIENT_SECRET',
  // Make sure this exactly matches what's configured in Google Cloud Console
  redirectUri: process.env.REACT_APP_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback',
  
  // Scopes required for calendar access
  scopes: [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events.readonly'
  ],
  
  // OAuth endpoints
  authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  
  // Local storage keys for tokens
  storageKeys: {
    accessToken: 'google_access_token',
    refreshToken: 'google_refresh_token',
    expiresAt: 'google_token_expires_at'
  }
};
