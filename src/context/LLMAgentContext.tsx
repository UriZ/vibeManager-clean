/**
 * LLM Agent Context
 * 
 * This context provides access to the LLM agents throughout the application.
 * It maintains the state of the agents and provides methods for interacting with them.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LLMCalendarAgent } from '../mcp/llm/LLMCalendarAgent';
import { DailyInsights } from '../mcp/calendar/models';

interface LLMAgentContextType {
  // Calendar Agent
  calendarAgent: LLMCalendarAgent;
  calendarAuthenticated: boolean;
  calendarAuthenticating: boolean;
  calendarError: string | null;
  calendarInsights: DailyInsights | null;
  
  // Calendar Actions
  authenticateCalendar: (authCode?: string) => Promise<boolean>;
  getCalendarAuthUrl: () => string;
  refreshCalendarInsights: (userId: string) => Promise<void>;
  
  // General Agent State
  isLoading: boolean;
}

const LLMAgentContext = createContext<LLMAgentContextType | undefined>(undefined);

interface LLMAgentProviderProps {
  children: ReactNode;
}

export const LLMAgentProvider: React.FC<LLMAgentProviderProps> = ({ children }) => {
  // Initialize agents
  const [calendarAgent] = useState<LLMCalendarAgent>(() => new LLMCalendarAgent());
  
  // Calendar state
  const [calendarAuthenticated, setCalendarAuthenticated] = useState<boolean>(false);
  const [calendarAuthenticating, setCalendarAuthenticating] = useState<boolean>(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [calendarInsights, setCalendarInsights] = useState<DailyInsights | null>(null);
  
  // General state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Initialize agents on mount
  useEffect(() => {
    const initializeAgents = async () => {
      try {
        // Try to initialize calendar agent (this might succeed if tokens are cached)
        const calendarInitialized = await calendarAgent.initialize();
        setCalendarAuthenticated(calendarInitialized);
      } catch (error) {
        console.error('Error initializing agents:', error);
        setCalendarError('Failed to initialize calendar agent');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAgents();
  }, [calendarAgent]);
  
  // Calendar authentication
  const authenticateCalendar = async (authCode?: string): Promise<boolean> => {
    setCalendarAuthenticating(true);
    setCalendarError(null);
    
    try {
      const success = await calendarAgent.initialize(authCode);
      setCalendarAuthenticated(success);
      return success;
    } catch (error) {
      console.error('Calendar authentication error:', error);
      setCalendarError('Failed to authenticate with Google Calendar');
      return false;
    } finally {
      setCalendarAuthenticating(false);
    }
  };
  
  // Get calendar auth URL
  const getCalendarAuthUrl = (): string => {
    return calendarAgent.getAuthUrl();
  };
  
  // Refresh calendar insights
  const refreshCalendarInsights = async (userId: string): Promise<void> => {
    if (!calendarAuthenticated) {
      setCalendarError('Calendar not authenticated');
      return;
    }
    
    try {
      const insights = await calendarAgent.getDailyInsights(userId);
      setCalendarInsights(insights);
    } catch (error) {
      console.error('Error fetching calendar insights:', error);
      setCalendarError('Failed to fetch calendar insights');
    }
  };
  
  const value: LLMAgentContextType = {
    // Calendar Agent
    calendarAgent,
    calendarAuthenticated,
    calendarAuthenticating,
    calendarError,
    calendarInsights,
    
    // Calendar Actions
    authenticateCalendar,
    getCalendarAuthUrl,
    refreshCalendarInsights,
    
    // General Agent State
    isLoading
  };
  
  return (
    <LLMAgentContext.Provider value={value}>
      {children}
    </LLMAgentContext.Provider>
  );
};

// Custom hook to use the LLM agent context
export const useLLMAgent = (): LLMAgentContextType => {
  const context = useContext(LLMAgentContext);
  if (context === undefined) {
    throw new Error('useLLMAgent must be used within an LLMAgentProvider');
  }
  return context;
};
