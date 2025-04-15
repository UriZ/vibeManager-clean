/**
 * Calendar MCP Server
 * 
 * This server implements the Model Context Protocol (MCP) for calendar integration.
 * It provides tools and resources for accessing and analyzing calendar data.
 */

import { GoogleCalendarAPI } from './google-calendar-api';
import { CalendarIntelligence } from './calendar-intelligence';
import { 
  CalendarEvent, 
  CalendarInsight, 
  DailyInsights, 
  MeetingPreparation,
  CalendarAnalysisRequest,
  CalendarAnalysisResponse
} from './models';
import { MCPServer, MCPTool, MCPResource } from '../core/MCPClient';

export class CalendarMCPServer implements MCPServer {
  public id: string = 'calendar-mcp-server';
  public name: string = 'Calendar MCP Server';
  public description: string = 'MCP Server for Google Calendar integration';
  
  private calendarAPI: GoogleCalendarAPI;
  private calendarIntelligence: CalendarIntelligence;
  private tools: MCPTool[] = [];
  private resources: MCPResource[] = [];
  private cachedEvents: CalendarEvent[] = [];
  private lastFetchTime: number = 0;
  private readonly cacheValidityMs: number = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.calendarAPI = new GoogleCalendarAPI();
    this.calendarIntelligence = new CalendarIntelligence();
    this.registerTools();
    this.registerResources();
  }

  /**
   * Initializes the server and authenticates with Google Calendar
   */
  public async initialize(authCode?: string): Promise<boolean> {
    if (authCode) {
      return await this.calendarAPI.exchangeCodeForTokens(authCode);
    }
    return true;
  }

  /**
   * Gets the Google Calendar authentication URL
   */
  public getAuthUrl(): string {
    return this.calendarAPI.getAuthUrl();
  }

  /**
   * Registers all MCP tools
   */
  private registerTools() {
    // List Events Tool
    this.tools.push({
      name: 'calendar.listEvents',
      description: 'Lists calendar events within a specified time range',
      parameters: {
        type: 'object',
        properties: {
          timeMin: { type: 'string', format: 'date-time' },
          timeMax: { type: 'string', format: 'date-time' },
          maxResults: { type: 'integer' }
        },
        required: ['timeMin', 'timeMax']
      },
      execute: async (params) => {
        const { timeMin, timeMax, maxResults = 10 } = params;
        return await this.calendarAPI.listEvents(timeMin, timeMax, maxResults);
      }
    });

    // Get Event Tool
    this.tools.push({
      name: 'calendar.getEvent',
      description: 'Gets a specific calendar event by ID',
      parameters: {
        type: 'object',
        properties: {
          eventId: { type: 'string' }
        },
        required: ['eventId']
      },
      execute: async (params) => {
        const { eventId } = params;
        return await this.calendarAPI.getEvent(eventId);
      }
    });

    // Analyze Schedule Tool
    this.tools.push({
      name: 'calendar.analyzeSchedule',
      description: 'Analyzes the user\'s schedule to identify conflicts, changes, and important events',
      parameters: {
        type: 'object',
        properties: {
          timeRange: { type: 'string', enum: ['today', 'tomorrow', 'week', 'month'] },
          userId: { type: 'string' },
          includeDeclinedEvents: { type: 'boolean' },
          includeCancelledEvents: { type: 'boolean' }
        },
        required: ['timeRange', 'userId']
      },
      execute: async (params: Record<string, any>) => {
        const events = await this.getCalendarEvents();
        // Convert params to CalendarAnalysisRequest
        const analysisRequest: CalendarAnalysisRequest = {
          timeRange: params.timeRange,
          userId: params.userId,
          includeDeclinedEvents: params.includeDeclinedEvents,
          includeCancelledEvents: params.includeCancelledEvents
        };
        return this.calendarIntelligence.analyzeSchedule(analysisRequest, events);
      }
    });

    // Generate Daily Insights Tool
    this.tools.push({
      name: 'calendar.getDailyInsights',
      description: 'Generates insights for the current day\'s calendar',
      parameters: {
        type: 'object',
        properties: {}
      },
      execute: async () => {
        const events = await this.getCalendarEvents();
        return this.calendarIntelligence.generateDailyInsights(events);
      }
    });

    // Generate Meeting Preparation Tool
    this.tools.push({
      name: 'calendar.generateMeetingPrep',
      description: 'Generates preparation materials for an upcoming meeting',
      parameters: {
        type: 'object',
        properties: {
          eventId: { type: 'string' },
          prepType: { type: 'string', enum: ['agenda', 'notes', 'summary', 'action-items'] }
        },
        required: ['eventId']
      },
      execute: async (params) => {
        const { eventId } = params;
        const event = await this.calendarAPI.getEvent(eventId);
        
        if (!event) {
          throw new Error(`Event with ID ${eventId} not found`);
        }
        
        return this.calendarIntelligence.generateMeetingPreparation(event);
      }
    });
  }

  /**
   * Registers all MCP resources
   */
  private registerResources() {
    // Upcoming Events Resource
    this.resources.push({
      uri: 'calendar://events/upcoming',
      contentType: 'application/json',
      description: 'Upcoming calendar events',
      read: async () => {
        return await this.calendarAPI.getUpcomingEvents(7);
      }
    });

    // Event Details Resource
    this.resources.push({
      uri: 'calendar://events/{eventId}',
      contentType: 'application/json',
      description: 'Specific calendar event details',
      read: async () => {
        // In a real implementation, we would parse the URI to extract the eventId
        // For now, this is a placeholder
        return null;
      }
    });

    // Daily Insights Resource
    this.resources.push({
      uri: 'calendar://insights/daily',
      contentType: 'application/json',
      description: 'Daily calendar insights and alerts',
      read: async () => {
        const events = await this.getCalendarEvents();
        return this.calendarIntelligence.generateDailyInsights(events);
      }
    });
  }

  /**
   * Gets a tool by name
   */
  public getTool(name: string): MCPTool | undefined {
    return this.tools.find(tool => tool.name === name);
  }

  /**
   * Lists all available tools
   */
  public listTools(): MCPTool[] {
    return this.tools;
  }

  /**
   * Gets a resource by URI
   */
  public getResource(uri: string): MCPResource | undefined {
    // In a real implementation, we would handle URI templates
    return this.resources.find(resource => resource.uri === uri);
  }

  /**
   * Lists all available resources
   */
  public listResources(): MCPResource[] {
    return this.resources;
  }

  // The listTools and listResources methods are already implemented above
  // These implementations satisfy the MCPServer interface
  
  /**
   * Executes a tool by name
   */
  public async executeTool(name: string, params: Record<string, any>): Promise<any> {
    const tool = this.getTool(name);
    
    if (!tool) {
      throw new Error(`Tool ${name} not found`);
    }
    
    return await tool.execute(params);
  }

  /**
   * Reads a resource by URI
   */
  public async readResource(uri: string): Promise<any> {
    const resource = this.getResource(uri);
    
    if (!resource) {
      throw new Error(`Resource ${uri} not found`);
    }
    
    return await resource.read();
  }

  /**
   * Gets calendar events with caching
   */
  private async getCalendarEvents(): Promise<CalendarEvent[]> {
    const now = Date.now();
    
    // If cache is valid, return cached events
    if (this.cachedEvents.length > 0 && now - this.lastFetchTime < this.cacheValidityMs) {
      return this.cachedEvents;
    }
    
    // Otherwise, fetch fresh events
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // Get events for the next 30 days
    
    this.cachedEvents = await this.calendarAPI.listEvents(
      startDate.toISOString(),
      endDate.toISOString(),
      100
    );
    
    this.lastFetchTime = now;
    return this.cachedEvents;
  }
}
