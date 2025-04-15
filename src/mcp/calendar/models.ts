/**
 * Calendar MCP - Data Models
 * 
 * This file contains the data models for the Calendar MCP implementation.
 */

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  attendees: Attendee[];
  organizer?: Attendee;
  recurrence?: string[];
  status: 'confirmed' | 'tentative' | 'cancelled';
  meetingLink?: string;
  attachments?: Attachment[];
  reminders?: Reminder[];
  metadata?: Record<string, any>;
}

export interface Attendee {
  id?: string;
  email: string;
  name?: string;
  responseStatus: 'accepted' | 'declined' | 'tentative' | 'needsAction';
  optional?: boolean;
  organizer?: boolean;
}

export interface Attachment {
  id: string;
  title: string;
  fileUrl: string;
  mimeType: string;
  iconLink?: string;
}

export interface Reminder {
  type: 'email' | 'popup' | 'notification';
  minutes: number;
}

export interface CalendarInsight {
  id: string;
  type: 'upcoming-meeting' | 'conflict' | 'change' | 'preparation-needed' | 'follow-up';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  relatedEventIds: string[];
  createdAt: string;
  expiresAt?: string;
  actions?: InsightAction[];
  metadata?: Record<string, any>;
}

export interface InsightAction {
  id: string;
  label: string;
  actionType: 'reschedule' | 'prepare' | 'follow-up' | 'cancel' | 'join' | 'custom';
  data?: Record<string, any>;
}

export interface DailyInsights {
  date: string;
  upcomingMeetings: {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    needsPreparation: boolean;
    preparationItems?: string[];
  }[];
  conflicts: {
    id: string;
    description: string;
    eventIds: string[];
    suggestedResolution?: string;
  }[];
  changes: {
    id: string;
    description: string;
    eventId: string;
    changeType: 'time' | 'location' | 'attendees' | 'cancelled' | 'new';
  }[];
  preparationTasks: {
    id: string;
    eventId: string;
    title: string;
    description: string;
    dueBy: string;
  }[];
}

export interface MeetingPreparation {
  eventId: string;
  title: string;
  agenda?: string[];
  notes?: string;
  actionItems?: string[];
  relevantDocuments?: {
    title: string;
    url: string;
    description?: string;
  }[];
  attendeeContext?: {
    attendeeId: string;
    name: string;
    notes?: string;
    previousMeetingOutcomes?: string[];
  }[];
}

export interface CalendarAnalysisRequest {
  timeRange: 'today' | 'tomorrow' | 'week' | 'month';
  userId: string;
  includeDeclinedEvents?: boolean;
  includeCancelledEvents?: boolean;
}

export interface CalendarAnalysisResponse {
  timeRange: {
    start: string;
    end: string;
  };
  summary: {
    totalEvents: number;
    totalMeetingHours: number;
    busyHoursPercentage: number;
    conflictCount: number;
    upcomingDeadlines: number;
  };
  insights: CalendarInsight[];
  recommendations: {
    id: string;
    type: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }[];
}
