/**
 * LLM Calendar Agent
 * 
 * This component serves as the bridge between the LLM and the Calendar MCP Server.
 * It provides a structured way for the LLM to discover and use calendar tools.
 */

import { MCPClient } from '../core/MCPClient';
import { CalendarMCPServer } from '../calendar/calendar-mcp-server';
import { 
  CalendarEvent, 
  CalendarInsight, 
  DailyInsights,
  MeetingPreparation
} from '../calendar/models';

export class LLMCalendarAgent {
  private mcpClient: MCPClient;
  private calendarServer: CalendarMCPServer;
  
  constructor() {
    this.mcpClient = new MCPClient();
    this.calendarServer = new CalendarMCPServer();
    
    // Register the calendar server with the MCP client
    this.mcpClient.registerServer(this.calendarServer);
  }
  
  /**
   * Initializes the agent and authenticates with Google Calendar
   */
  public async initialize(authCode?: string): Promise<boolean> {
    return await this.calendarServer.initialize(authCode);
  }
  
  /**
   * Gets the Google Calendar authentication URL
   */
  public getAuthUrl(): string {
    return this.calendarServer.getAuthUrl();
  }
  
  /**
   * Discovers and returns all available calendar tools
   * This is what the LLM would use to understand what tools are available
   */
  public discoverTools(): { name: string; description: string; parameters: any }[] {
    return this.mcpClient.getTools();
  }
  
  /**
   * Discovers and returns all available calendar resources
   * This is what the LLM would use to understand what resources are available
   */
  public discoverResources(): { uri: string; contentType: string; description: string }[] {
    return this.mcpClient.getResources();
  }
  
  /**
   * Executes a calendar tool by name
   * This is what the LLM would call after deciding which tool to use
   */
  public async executeTool(toolName: string, params: Record<string, any>): Promise<any> {
    return await this.mcpClient.executeTool(toolName, params);
  }
  
  /**
   * Reads a calendar resource by URI
   * This is what the LLM would call to access static resources
   */
  public async readResource(resourceUri: string): Promise<any> {
    return await this.mcpClient.readResource(resourceUri);
  }
  
  /**
   * Helper method to get upcoming calendar events
   */
  public async getUpcomingEvents(hours: number = 24, maxResults?: number): Promise<CalendarEvent[]> {
    return await this.executeTool('calendar.getUpcomingEvents', { hours, maxResults });
  }
  
  /**
   * Helper method to get daily insights
   */
  public async getDailyInsights(userId: string): Promise<DailyInsights> {
    return await this.executeTool('calendar.getDailyInsights', { userId });
  }
  
  /**
   * Helper method to analyze the user's schedule
   */
  public async analyzeSchedule(start: string, end: string, userId: string): Promise<CalendarInsight[]> {
    return await this.executeTool('calendar.analyzeSchedule', {
      timeRange: { start, end },
      userId
    });
  }
  
  /**
   * Helper method to prepare for a meeting
   */
  public async prepareMeeting(eventId: string): Promise<MeetingPreparation> {
    return await this.executeTool('calendar.prepareMeeting', { eventId });
  }
}
