/**
 * Calendar Intelligence Service
 * 
 * This service analyzes calendar data to generate insights, detect conflicts,
 * and provide recommendations for meeting preparation and follow-ups.
 */

import { 
  CalendarEvent, 
  CalendarInsight, 
  DailyInsights, 
  MeetingPreparation,
  CalendarAnalysisRequest,
  CalendarAnalysisResponse
} from './models';

export class CalendarIntelligence {
  /**
   * Analyzes a set of calendar events to identify insights
   */
  public analyzeEvents(events: CalendarEvent[]): CalendarInsight[] {
    const insights: CalendarInsight[] = [];
    
    // Find upcoming meetings that need preparation
    insights.push(...this.identifyMeetingsNeedingPreparation(events));
    
    // Detect schedule conflicts
    insights.push(...this.detectScheduleConflicts(events));
    
    // Identify recent changes to meetings
    insights.push(...this.identifyRecentChanges(events));
    
    return insights;
  }

  /**
   * Generates daily insights from calendar events
   */
  public generateDailyInsights(events: CalendarEvent[]): DailyInsights {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Filter events for today
    const todayEvents = events.filter(event => {
      const eventStart = new Date(event.startTime);
      return eventStart >= today && eventStart < tomorrow;
    });
    
    // Sort events by start time
    todayEvents.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    // Generate insights
    const insights = this.analyzeEvents(events);
    
    // Extract conflicts
    const conflicts = insights
      .filter(insight => insight.type === 'conflict')
      .map(insight => ({
        id: insight.id,
        description: insight.description,
        eventIds: insight.relatedEventIds,
        suggestedResolution: insight.metadata?.suggestedResolution
      }));
    
    // Extract changes
    const changes = insights
      .filter(insight => insight.type === 'change')
      .map(insight => ({
        id: insight.id,
        description: insight.description,
        eventId: insight.relatedEventIds[0],
        changeType: insight.metadata?.changeType || 'time'
      }));
    
    // Extract upcoming meetings
    const upcomingMeetings = todayEvents.map(event => ({
      id: event.id,
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      needsPreparation: insights.some(
        insight => insight.type === 'preparation-needed' && insight.relatedEventIds.includes(event.id)
      ),
      preparationItems: insights.find(
        insight => insight.type === 'preparation-needed' && insight.relatedEventIds.includes(event.id)
      )?.metadata?.preparationItems
    }));
    
    // Extract preparation tasks
    const preparationTasks = insights
      .filter(insight => insight.type === 'preparation-needed')
      .map(insight => ({
        id: insight.id,
        eventId: insight.relatedEventIds[0],
        title: `Prepare for: ${insight.title}`,
        description: insight.description,
        dueBy: insight.metadata?.dueBy || insight.relatedEventIds[0]
      }));
    
    return {
      date: today.toISOString().split('T')[0],
      upcomingMeetings,
      conflicts,
      changes,
      preparationTasks
    };
  }

  /**
   * Analyzes the user's schedule based on the specified time range
   */
  public analyzeSchedule(request: CalendarAnalysisRequest, events: CalendarEvent[]): CalendarAnalysisResponse {
    // Determine time range
    const now = new Date();
    let endDate: Date;
    
    switch (request.timeRange) {
      case 'today':
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'tomorrow':
        endDate = new Date(now);
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'week':
        endDate = new Date(now);
        endDate.setDate(endDate.getDate() + 7);
        break;
      case 'month':
        endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      default:
        endDate = new Date(now);
        endDate.setDate(endDate.getDate() + 7);
    }
    
    // Filter events based on time range and options
    const filteredEvents = events.filter(event => {
      const eventStart = new Date(event.startTime);
      
      // Skip if event is in the past
      if (eventStart < now) return false;
      
      // Skip if event is beyond the end date
      if (eventStart > endDate) return false;
      
      // Skip declined events if not requested
      if (!request.includeDeclinedEvents) {
        const userAttendee = event.attendees.find(a => a.email === request.userId);
        if (userAttendee && userAttendee.responseStatus === 'declined') return false;
      }
      
      // Skip cancelled events if not requested
      if (!request.includeCancelledEvents && event.status === 'cancelled') return false;
      
      return true;
    });
    
    // Generate insights
    const insights = this.analyzeEvents(filteredEvents);
    
    // Calculate total meeting hours
    const totalMeetingHours = filteredEvents.reduce((total, event) => {
      const start = new Date(event.startTime);
      const end = new Date(event.endTime);
      const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + durationHours;
    }, 0);
    
    // Calculate busy hours percentage (assuming 8-hour workdays)
    const workDays = this.getWorkdaysBetweenDates(now, endDate);
    const totalWorkHours = workDays * 8;
    const busyHoursPercentage = totalWorkHours > 0 ? (totalMeetingHours / totalWorkHours) * 100 : 0;
    
    // Count conflicts
    const conflictCount = insights.filter(insight => insight.type === 'conflict').length;
    
    // Count upcoming deadlines (placeholder - would need task integration)
    const upcomingDeadlines = 0;
    
    // Generate recommendations based on insights
    const recommendations = this.generateRecommendations(insights, filteredEvents, busyHoursPercentage);
    
    return {
      timeRange: {
        start: now.toISOString(),
        end: endDate.toISOString()
      },
      summary: {
        totalEvents: filteredEvents.length,
        totalMeetingHours,
        busyHoursPercentage,
        conflictCount,
        upcomingDeadlines
      },
      insights,
      recommendations
    };
  }

  /**
   * Generates meeting preparation materials
   */
  public generateMeetingPreparation(event: CalendarEvent): MeetingPreparation {
    // In a real implementation, this would analyze the meeting details,
    // potentially fetch related documents, and generate a comprehensive preparation
    
    const preparation: MeetingPreparation = {
      eventId: event.id,
      title: `Preparation for: ${event.title}`,
      agenda: this.extractAgendaFromDescription(event.description || ''),
      notes: this.generateMeetingNotes(event),
      actionItems: [],
      relevantDocuments: [],
      attendeeContext: event.attendees.map(attendee => ({
        attendeeId: attendee.email,
        name: attendee.name || attendee.email.split('@')[0],
        notes: '',
        previousMeetingOutcomes: []
      }))
    };
    
    return preparation;
  }

  /**
   * Identifies meetings that need preparation
   */
  private identifyMeetingsNeedingPreparation(events: CalendarEvent[]): CalendarInsight[] {
    const now = new Date();
    const insights: CalendarInsight[] = [];
    
    // Look for meetings in the next 24 hours that might need preparation
    const upcomingEvents = events.filter(event => {
      const eventStart = new Date(event.startTime);
      const hoursDifference = (eventStart.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      // Consider meetings in the next 24 hours
      return hoursDifference > 0 && hoursDifference <= 24;
    });
    
    for (const event of upcomingEvents) {
      // Determine if this meeting needs preparation based on various factors
      const needsPreparation = this.doesMeetingNeedPreparation(event);
      
      if (needsPreparation) {
        const preparationItems = this.generatePreparationItems(event);
        
        insights.push({
          id: `prep-${event.id}`,
          type: 'preparation-needed',
          title: `Prepare for: ${event.title}`,
          description: `You have a meeting "${event.title}" at ${new Date(event.startTime).toLocaleTimeString()} that requires preparation.`,
          priority: this.determineMeetingPriority(event),
          relatedEventIds: [event.id],
          createdAt: new Date().toISOString(),
          expiresAt: event.startTime,
          actions: [
            {
              id: `prepare-${event.id}`,
              label: 'Prepare Now',
              actionType: 'prepare',
              data: { eventId: event.id }
            }
          ],
          metadata: {
            preparationItems,
            dueBy: event.startTime
          }
        });
      }
    }
    
    return insights;
  }

  /**
   * Detects schedule conflicts between events
   */
  private detectScheduleConflicts(events: CalendarEvent[]): CalendarInsight[] {
    const insights: CalendarInsight[] = [];
    
    // Sort events by start time
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    
    // Check for overlapping events
    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const event1 = sortedEvents[i];
      const event1End = new Date(event1.endTime);
      
      for (let j = i + 1; j < sortedEvents.length; j++) {
        const event2 = sortedEvents[j];
        const event2Start = new Date(event2.startTime);
        
        // If event2 starts before event1 ends, we have a conflict
        if (event2Start < event1End) {
          const event1Start = new Date(event1.startTime);
          const event2End = new Date(event2.endTime);
          
          // Calculate overlap in minutes
          const overlapStart = event2Start > event1Start ? event2Start : event1Start;
          const overlapEnd = event2End < event1End ? event2End : event1End;
          const overlapMinutes = (overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60);
          
          // Only consider significant overlaps (more than 5 minutes)
          if (overlapMinutes > 5) {
            const suggestedResolution = this.suggestConflictResolution(event1, event2);
            
            insights.push({
              id: `conflict-${event1.id}-${event2.id}`,
              type: 'conflict',
              title: 'Schedule Conflict',
              description: `You have a scheduling conflict between "${event1.title}" and "${event2.title}" on ${event1Start.toLocaleDateString()}.`,
              priority: 'high',
              relatedEventIds: [event1.id, event2.id],
              createdAt: new Date().toISOString(),
              expiresAt: event1.startTime,
              actions: [
                {
                  id: `resolve-${event1.id}-${event2.id}`,
                  label: 'Resolve Conflict',
                  actionType: 'reschedule',
                  data: { eventIds: [event1.id, event2.id] }
                }
              ],
              metadata: {
                overlapMinutes,
                suggestedResolution
              }
            });
            
            // No need to check further conflicts with event1
            break;
          }
        }
      }
    }
    
    return insights;
  }

  /**
   * Identifies recent changes to meetings
   */
  private identifyRecentChanges(events: CalendarEvent[]): CalendarInsight[] {
    // In a real implementation, this would track changes to events over time
    // For now, we'll return an empty array as a placeholder
    return [];
  }

  /**
   * Determines if a meeting needs preparation based on various factors
   */
  private doesMeetingNeedPreparation(event: CalendarEvent): boolean {
    // Check if the meeting is long (over 30 minutes)
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    
    if (durationMinutes > 30) return true;
    
    // Check if there are multiple attendees
    if (event.attendees.length > 3) return true;
    
    // Check if the title or description contains keywords suggesting preparation
    const preparationKeywords = [
      'review', 'discuss', 'planning', 'strategy', 'decision',
      'presentation', 'report', 'update', 'sync', 'alignment',
      'interview', 'evaluation', 'assessment', 'quarterly', 'annual'
    ];
    
    const titleAndDescription = `${event.title} ${event.description || ''}`.toLowerCase();
    
    for (const keyword of preparationKeywords) {
      if (titleAndDescription.includes(keyword)) return true;
    }
    
    return false;
  }

  /**
   * Determines the priority of a meeting
   */
  private determineMeetingPriority(event: CalendarEvent): 'low' | 'medium' | 'high' | 'critical' {
    // Check if this is a 1:1 with a direct report or manager (high priority)
    const title = event.title.toLowerCase();
    if (title.includes('1:1') || title.includes('one on one') || title.includes('1-on-1')) {
      return 'high';
    }
    
    // Check attendee count
    if (event.attendees.length > 5) {
      return 'high'; // Meetings with many attendees are higher priority
    }
    
    // Check duration
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    
    if (durationMinutes > 60) {
      return 'high'; // Longer meetings are higher priority
    }
    
    // Check for critical keywords
    const criticalKeywords = [
      'urgent', 'critical', 'emergency', 'important', 'priority',
      'deadline', 'review', 'decision', 'approval', 'executive'
    ];
    
    const titleAndDescription = `${event.title} ${event.description || ''}`.toLowerCase();
    
    for (const keyword of criticalKeywords) {
      if (titleAndDescription.includes(keyword)) return 'high';
    }
    
    return 'medium';
  }

  /**
   * Generates preparation items for a meeting
   */
  private generatePreparationItems(event: CalendarEvent): string[] {
    const items: string[] = [];
    
    // Review meeting details
    items.push('Review meeting agenda and objectives');
    
    // Check if there's an agenda to extract
    if (event.description && event.description.includes('agenda')) {
      items.push('Review the provided agenda');
    }
    
    // Prepare based on meeting type
    const title = event.title.toLowerCase();
    
    if (title.includes('1:1') || title.includes('one on one')) {
      items.push('Prepare updates on your current projects');
      items.push('Note any challenges or blockers to discuss');
      items.push('Prepare questions or topics you want to address');
    } else if (title.includes('review') || title.includes('status')) {
      items.push('Prepare status updates on relevant projects');
      items.push('Gather metrics and progress data');
    } else if (title.includes('interview')) {
      items.push('Review candidate resume and application materials');
      items.push('Prepare interview questions');
    } else if (title.includes('planning') || title.includes('strategy')) {
      items.push('Review relevant background materials');
      items.push('Prepare ideas or proposals to share');
    }
    
    // Always good to prepare
    items.push('Review previous meeting notes if available');
    
    return items;
  }

  /**
   * Suggests a resolution for a scheduling conflict
   */
  private suggestConflictResolution(event1: CalendarEvent, event2: CalendarEvent): string {
    // Determine which event might be easier to reschedule
    const event1Start = new Date(event1.startTime);
    const event1End = new Date(event1.endTime);
    const event2Start = new Date(event2.startTime);
    const event2End = new Date(event2.endTime);
    
    const event1Duration = event1End.getTime() - event1Start.getTime();
    const event2Duration = event2End.getTime() - event2Start.getTime();
    
    // Shorter meetings are easier to reschedule
    if (event1Duration < event2Duration) {
      return `Consider rescheduling "${event1.title}" to a later time.`;
    } else if (event2Duration < event1Duration) {
      return `Consider rescheduling "${event2.title}" to a later time.`;
    }
    
    // Meetings with fewer attendees are easier to reschedule
    if (event1.attendees.length < event2.attendees.length) {
      return `Consider rescheduling "${event1.title}" as it has fewer attendees.`;
    } else if (event2.attendees.length < event1.attendees.length) {
      return `Consider rescheduling "${event2.title}" as it has fewer attendees.`;
    }
    
    // Default suggestion
    return `Review both meetings and determine which one can be rescheduled.`;
  }

  /**
   * Extracts agenda items from a meeting description
   */
  private extractAgendaFromDescription(description: string): string[] {
    if (!description) return [];
    
    const agendaItems: string[] = [];
    
    // Look for common agenda patterns
    
    // Pattern 1: Lines after "Agenda:" or "Agenda"
    const agendaMatch = description.match(/agenda:?\s*(.+?)(?:\n\n|\n[^-*\s]|$)/i);
    if (agendaMatch && agendaMatch[1]) {
      const agendaText = agendaMatch[1].trim();
      const lines = agendaText.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || /^\d+\./.test(trimmedLine))) {
          agendaItems.push(trimmedLine.replace(/^[-*\d.]\s*/, ''));
        }
      }
    }
    
    // Pattern 2: Bullet points anywhere in the description
    if (agendaItems.length === 0) {
      const bulletMatches = description.match(/(?:^|\n)(?:[-*]\s*|\d+\.\s*)(.+)(?:\n|$)/g);
      if (bulletMatches) {
        for (const match of bulletMatches) {
          const trimmedLine = match.trim();
          agendaItems.push(trimmedLine.replace(/^[-*\d.]\s*/, ''));
        }
      }
    }
    
    return agendaItems;
  }

  /**
   * Generates meeting notes template
   */
  private generateMeetingNotes(event: CalendarEvent): string {
    const date = new Date(event.startTime).toLocaleDateString();
    const startTime = new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let notes = `# ${event.title}\n\n`;
    notes += `**Date:** ${date}\n`;
    notes += `**Time:** ${startTime} - ${endTime}\n\n`;
    
    notes += `**Attendees:**\n`;
    for (const attendee of event.attendees) {
      const name = attendee.name || attendee.email.split('@')[0];
      notes += `- ${name}\n`;
    }
    notes += '\n';
    
    const agenda = this.extractAgendaFromDescription(event.description || '');
    if (agenda.length > 0) {
      notes += `**Agenda:**\n`;
      for (const item of agenda) {
        notes += `- ${item}\n`;
      }
      notes += '\n';
    }
    
    notes += `**Discussion Notes:**\n\n`;
    notes += `**Action Items:**\n\n`;
    notes += `**Next Steps:**\n\n`;
    
    return notes;
  }

  /**
   * Generates recommendations based on insights and calendar data
   */
  private generateRecommendations(
    insights: CalendarInsight[], 
    events: CalendarEvent[], 
    busyHoursPercentage: number
  ): { id: string; type: string; description: string; priority: 'low' | 'medium' | 'high' }[] {
    const recommendations: { id: string; type: string; description: string; priority: 'low' | 'medium' | 'high' }[] = [];
    
    // Check for meeting overload
    if (busyHoursPercentage > 70) {
      recommendations.push({
        id: 'rec-meeting-overload',
        type: 'meeting-reduction',
        description: 'You have a high meeting load. Consider blocking focus time or declining non-essential meetings.',
        priority: 'high'
      });
    }
    
    // Check for back-to-back meetings
    const backToBackMeetings = this.detectBackToBackMeetings(events);
    if (backToBackMeetings.length > 0) {
      recommendations.push({
        id: 'rec-back-to-back',
        type: 'meeting-spacing',
        description: 'You have several back-to-back meetings. Consider adding buffer time between meetings.',
        priority: 'medium'
      });
    }
    
    // Check for conflicts
    const conflicts = insights.filter(insight => insight.type === 'conflict');
    if (conflicts.length > 0) {
      recommendations.push({
        id: 'rec-conflicts',
        type: 'conflict-resolution',
        description: `You have ${conflicts.length} scheduling conflicts. Review and resolve them as soon as possible.`,
        priority: 'high'
      });
    }
    
    // Check for preparation needs
    const prepNeeded = insights.filter(insight => insight.type === 'preparation-needed');
    if (prepNeeded.length > 0) {
      recommendations.push({
        id: 'rec-preparation',
        type: 'meeting-preparation',
        description: `You have ${prepNeeded.length} meetings that require preparation. Schedule time to prepare.`,
        priority: 'medium'
      });
    }
    
    return recommendations;
  }

  /**
   * Detects back-to-back meetings in the calendar
   */
  private detectBackToBackMeetings(events: CalendarEvent[]): CalendarEvent[][] {
    const result: CalendarEvent[][] = [];
    
    // Sort events by start time
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    
    // Look for consecutive meetings with less than 15 minutes between them
    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const currentEvent = sortedEvents[i];
      const nextEvent = sortedEvents[i + 1];
      
      const currentEnd = new Date(currentEvent.endTime);
      const nextStart = new Date(nextEvent.startTime);
      
      const bufferMinutes = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60);
      
      if (bufferMinutes < 15) {
        result.push([currentEvent, nextEvent]);
      }
    }
    
    return result;
  }

  /**
   * Calculates the number of workdays between two dates
   */
  private getWorkdaysBetweenDates(startDate: Date, endDate: Date): number {
    let count = 0;
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Not a weekend
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return count;
  }
}
