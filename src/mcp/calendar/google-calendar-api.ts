/**
 * Google Calendar API Adapter
 * 
 * This adapter handles the communication with the Google Calendar API.
 * It provides methods for authentication and data retrieval.
 */

import { CalendarEvent, Attendee, Attachment, Reminder } from './models';
import { googleOAuthConfig } from '../../config/oauth';
import { debugLog, debugError, addToDebugOverlay } from '../../utils/debug';

export class GoogleCalendarAPI {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number = 0;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly storageKeys = googleOAuthConfig.storageKeys;

  constructor(clientId?: string, clientSecret?: string, redirectUri?: string) {
    this.clientId = clientId || googleOAuthConfig.clientId;
    this.clientSecret = clientSecret || googleOAuthConfig.clientSecret;
    this.redirectUri = redirectUri || googleOAuthConfig.redirectUri;
    
    // Try to load tokens from localStorage
    this.loadTokensFromStorage();
  }

  /**
   * Loads tokens from localStorage if available
   */
  private loadTokensFromStorage(): void {
    try {
      const accessToken = localStorage.getItem(this.storageKeys.accessToken);
      const refreshToken = localStorage.getItem(this.storageKeys.refreshToken);
      const expiresAtStr = localStorage.getItem(this.storageKeys.expiresAt);
      
      if (accessToken) this.accessToken = accessToken;
      if (refreshToken) this.refreshToken = refreshToken;
      if (expiresAtStr) this.expiresAt = parseInt(expiresAtStr, 10);
      
      debugLog('Loaded tokens from storage', {
        hasAccessToken: !!this.accessToken,
        hasRefreshToken: !!this.refreshToken,
        expiresAt: this.expiresAt ? new Date(this.expiresAt).toISOString() : 'none'
      });
      
      addToDebugOverlay(`Auth status: ${this.isAuthenticated() ? 'Authenticated' : 'Not authenticated'}`);
    } catch (error) {
      debugError('Error loading tokens from storage', error);
    }
  }
  
  /**
   * Saves tokens to localStorage
   */
  private saveTokensToStorage(): void {
    try {
      if (this.accessToken) {
        localStorage.setItem(this.storageKeys.accessToken, this.accessToken);
        debugLog('Access token saved to storage', { tokenLength: this.accessToken.length });
      } else {
        debugLog('No access token to save');
      }
      
      if (this.refreshToken) {
        localStorage.setItem(this.storageKeys.refreshToken, this.refreshToken);
        debugLog('Refresh token saved to storage', { tokenLength: this.refreshToken.length });
      } else {
        debugLog('No refresh token to save');
      }
      
      if (this.expiresAt > 0) {
        localStorage.setItem(this.storageKeys.expiresAt, this.expiresAt.toString());
        const expiresInMinutes = Math.round((this.expiresAt - Date.now()) / (60 * 1000));
        debugLog('Token expiration saved', { expiresInMinutes });
        addToDebugOverlay(`Token expires in ${expiresInMinutes} minutes`);
      }
      
      addToDebugOverlay('Tokens saved to storage');
    } catch (error: any) {
      debugError('Error saving tokens to storage', error);
      addToDebugOverlay(`Error saving tokens: ${error?.message || 'Unknown error'}`);
    }
  }
  
  /**
   * Generates the OAuth URL for Google Calendar authorization
   */
  public getAuthUrl(): string {
    const url = new URL(googleOAuthConfig.authEndpoint);
    url.searchParams.append('client_id', this.clientId);
    url.searchParams.append('redirect_uri', this.redirectUri);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', googleOAuthConfig.scopes.join(' '));
    url.searchParams.append('access_type', 'offline');
    url.searchParams.append('prompt', 'consent');
    
    const authUrl = url.toString();
    debugLog('Generated auth URL', { 
      clientId: this.clientId,
      redirectUri: this.redirectUri,
      url: authUrl
    });
    addToDebugOverlay(`Auth URL generated with redirect: ${this.redirectUri}`);
    
    return authUrl;
  }

  /**
   * Exchanges the authorization code for access and refresh tokens
   */
  public async exchangeCodeForTokens(code: string): Promise<boolean> {
    try {
      debugLog('Exchanging code for tokens', { codeLength: code.length });
      addToDebugOverlay('Exchanging auth code for tokens...');
      
      const params = new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code'
      });
      
      debugLog('Token request parameters', {
        clientId: this.clientId,
        redirectUri: this.redirectUri,
        endpoint: googleOAuthConfig.tokenEndpoint
      });
      
      const response = await fetch(googleOAuthConfig.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });

      if (!response.ok) {
        const errorText = await response.text();
        debugError(`Token exchange failed: ${response.status}`, errorText);
        addToDebugOverlay(`Auth error: ${response.status} - ${errorText.substring(0, 50)}...`);
        
        try {
          const errorData = JSON.parse(errorText);
          debugError('Error details', errorData);
          
          // Check for specific error types
          if (errorData.error === 'invalid_grant') {
            addToDebugOverlay('Invalid grant error - code may be expired or already used');
          } else if (errorData.error === 'invalid_client') {
            addToDebugOverlay('Invalid client error - check client ID and secret');
          }
        } catch (e) {
          // If the error text is not valid JSON, log as plain text
          addToDebugOverlay(`Non-JSON error response: ${errorText.substring(0, 100)}`);
        }
        return false;
      }

      const data = await response.json();
      debugLog('Received token response', { 
        hasAccessToken: !!data.access_token,
        hasRefreshToken: !!data.refresh_token,
        expiresIn: data.expires_in,
        tokenType: data.token_type
      });
      
      addToDebugOverlay('Successfully received tokens!');
      
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token || this.refreshToken;
      this.expiresAt = Date.now() + (data.expires_in * 1000);
      
      // Save tokens to storage
      this.saveTokensToStorage();

      return true;
    } catch (error: any) {
      debugError('Exception during token exchange', error);
      addToDebugOverlay(`Auth exception: ${error?.message || 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Refreshes the access token using the refresh token
   */
  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      console.error('No refresh token available');
      return false;
    }

    try {
      console.log('Refreshing access token...');
      const response = await fetch(googleOAuthConfig.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          refresh_token: this.refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'refresh_token'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error refreshing access token:', response.status, errorText);
        return false;
      }

      const data = await response.json();
      console.log('Refreshed access token, expires in:', data.expires_in);
      
      this.accessToken = data.access_token;
      this.expiresAt = Date.now() + (data.expires_in * 1000);
      
      // Save updated tokens to storage
      this.saveTokensToStorage();

      return true;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return false;
    }
  }

  /**
   * Ensures the access token is valid, refreshing if necessary
   */
  private async ensureValidToken(): Promise<boolean> {
    // If token is expired or about to expire (within 5 minutes), refresh it
    if (!this.accessToken || Date.now() > this.expiresAt - (5 * 60 * 1000)) {
      return await this.refreshAccessToken();
    }
    return true;
  }

  /**
   * Checks if the user is authenticated
   */
  public isAuthenticated(): boolean {
    const isAuth = !!this.accessToken && Date.now() < this.expiresAt;
    debugLog('Checking authentication status', { 
      hasAccessToken: !!this.accessToken,
      expiresAt: this.expiresAt ? new Date(this.expiresAt).toISOString() : 'none',
      isAuthenticated: isAuth
    });
    return isAuth;
  }
  
  /**
   * Clears all authentication tokens
   */
  public clearAuthentication(): void {
    debugLog('Clearing authentication tokens');
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = 0;
    
    // Clear from storage
    try {
      localStorage.removeItem(this.storageKeys.accessToken);
      localStorage.removeItem(this.storageKeys.refreshToken);
      localStorage.removeItem(this.storageKeys.expiresAt);
      addToDebugOverlay('Authentication tokens cleared');
    } catch (error: any) {
      debugError('Error clearing tokens from storage', error);
    }
  }

  /**
   * Lists calendar events within a specified time range
   */
  public async listEvents(timeMin: string, timeMax: string, maxResults: number = 10): Promise<CalendarEvent[]> {
    if (!await this.ensureValidToken()) {
      throw new Error('Failed to ensure valid token');
    }

    try {
      const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
      url.searchParams.append('timeMin', timeMin);
      url.searchParams.append('timeMax', timeMax);
      url.searchParams.append('maxResults', maxResults.toString());
      url.searchParams.append('singleEvents', 'true');
      url.searchParams.append('orderBy', 'startTime');

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data = await response.json();
      return this.transformGoogleEvents(data.items);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  }

  /**
   * Gets a specific calendar event by ID
   */
  public async getEvent(eventId: string): Promise<CalendarEvent | null> {
    if (!await this.ensureValidToken()) {
      throw new Error('Failed to ensure valid token');
    }

    try {
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch event: ${response.statusText}`);
      }

      const data = await response.json();
      const events = this.transformGoogleEvents([data]);
      return events.length > 0 ? events[0] : null;
    } catch (error) {
      console.error(`Error fetching calendar event ${eventId}:`, error);
      return null;
    }
  }

  /**
   * Gets upcoming events (next 7 days by default)
   */
  public async getUpcomingEvents(days: number = 7): Promise<CalendarEvent[]> {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);
    
    return await this.listEvents(now.toISOString(), future.toISOString(), 50);
  }

  /**
   * Transforms Google Calendar events to our internal format
   */
  private transformGoogleEvents(googleEvents: any[]): CalendarEvent[] {
    return googleEvents.map(event => {
      const attendees: Attendee[] = (event.attendees || []).map((attendee: any) => ({
        email: attendee.email,
        name: attendee.displayName || undefined,
        responseStatus: attendee.responseStatus || 'needsAction',
        optional: attendee.optional || false,
        organizer: attendee.organizer || false
      }));

      const attachments: Attachment[] = (event.attachments || []).map((attachment: any) => ({
        id: attachment.fileId,
        title: attachment.title,
        fileUrl: attachment.fileUrl,
        mimeType: attachment.mimeType,
        iconLink: attachment.iconLink
      }));

      const reminders: Reminder[] = event.reminders?.overrides?.map((reminder: any) => ({
        type: reminder.method === 'email' ? 'email' : 'popup',
        minutes: reminder.minutes
      })) || [];

      return {
        id: event.id,
        title: event.summary,
        description: event.description,
        startTime: event.start.dateTime || event.start.date,
        endTime: event.end.dateTime || event.end.date,
        location: event.location,
        attendees,
        organizer: event.organizer ? {
          email: event.organizer.email,
          name: event.organizer.displayName,
          responseStatus: 'accepted',
          organizer: true
        } : undefined,
        recurrence: event.recurrence,
        status: event.status,
        meetingLink: event.hangoutLink || event.conferenceData?.entryPoints?.[0]?.uri,
        attachments,
        reminders,
        metadata: {
          htmlLink: event.htmlLink,
          created: event.created,
          updated: event.updated,
          iCalUID: event.iCalUID,
          colorId: event.colorId
        }
      };
    });
  }
}
