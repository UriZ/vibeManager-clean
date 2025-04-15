/**
 * Calendar MCP Hook
 * 
 * A React hook for interacting with the Calendar MCP server.
 */

import { useState, useEffect, useCallback } from 'react';
import { CalendarMCPServer } from '../mcp/calendar/calendar-mcp-server';
import { 
  CalendarEvent, 
  DailyInsights, 
  MeetingPreparation,
  CalendarAnalysisRequest,
  CalendarAnalysisResponse
} from '../mcp/calendar/models';

export const useCalendarMCP = () => {
  const [server, setServer] = useState<CalendarMCPServer | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the server
  useEffect(() => {
    const initServer = async () => {
      try {
        const serverInstance = new CalendarMCPServer();
        const initialized = await serverInstance.initialize();
        setServer(serverInstance);
        setIsAuthenticated(initialized);
      } catch (err) {
        setError('Failed to initialize Calendar MCP server');
        console.error(err);
      }
    };

    initServer();
  }, []);

  // Get authentication URL
  const getAuthUrl = useCallback(() => {
    if (!server) return '';
    return server.getAuthUrl();
  }, [server]);

  // Authenticate with code
  const authenticate = useCallback(async (authCode: string) => {
    if (!server) {
      setError('Server not initialized');
      return false;
    }

    try {
      setIsLoading(true);
      const success = await server.initialize(authCode);
      setIsAuthenticated(success);
      return success;
    } catch (err) {
      setError('Authentication failed');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [server]);

  // List calendar events
  const listEvents = useCallback(async (
    timeMin: string, 
    timeMax: string, 
    maxResults: number = 10
  ): Promise<CalendarEvent[]> => {
    if (!server || !isAuthenticated) {
      setError('Not authenticated');
      return [];
    }

    try {
      setIsLoading(true);
      return await server.executeTool('calendar.listEvents', {
        timeMin,
        timeMax,
        maxResults
      });
    } catch (err) {
      setError('Failed to list events');
      console.error(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [server, isAuthenticated]);

  // Get calendar insights
  const getCalendarInsights = useCallback(async (): Promise<DailyInsights | null> => {
    if (!server || !isAuthenticated) {
      setError('Not authenticated');
      return null;
    }

    try {
      setIsLoading(true);
      return await server.executeTool('calendar.getDailyInsights', {});
    } catch (err) {
      setError('Failed to get calendar insights');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [server, isAuthenticated]);

  // Analyze schedule
  const analyzeSchedule = useCallback(async (
    request: CalendarAnalysisRequest
  ): Promise<CalendarAnalysisResponse | null> => {
    if (!server || !isAuthenticated) {
      setError('Not authenticated');
      return null;
    }

    try {
      setIsLoading(true);
      return await server.executeTool('calendar.analyzeSchedule', request);
    } catch (err) {
      setError('Failed to analyze schedule');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [server, isAuthenticated]);

  // Generate meeting preparation
  const generateMeetingPrep = useCallback(async (
    eventId: string,
    prepType: string = 'notes'
  ): Promise<MeetingPreparation | null> => {
    if (!server || !isAuthenticated) {
      setError('Not authenticated');
      return null;
    }

    try {
      setIsLoading(true);
      return await server.executeTool('calendar.generateMeetingPrep', {
        eventId,
        prepType
      });
    } catch (err) {
      setError('Failed to generate meeting preparation');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [server, isAuthenticated]);

  return {
    isAuthenticated,
    isLoading,
    error,
    getAuthUrl,
    authenticate,
    listEvents,
    getCalendarInsights,
    analyzeSchedule,
    generateMeetingPrep
  };
};
