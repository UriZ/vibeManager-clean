import React, { useState } from 'react';
import { TeamMember } from '../../models/TeamMember';

interface TeamDashboardProps {
  teamMembers: TeamMember[];
  currentUser: TeamMember;
  onViewTeam: (managerId: string) => void;
  isTeamView?: boolean;
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ 
  teamMembers, 
  currentUser,
  onViewTeam,
  isTeamView = false
}) => {
  // Get direct reports for the current user
  const directReports = teamMembers.filter(member => 
    member.managerId === currentUser.id
  );
  
  // Get status color based on sprint commitment status, workload and flagged items
  const getStatusColor = (member: TeamMember) => {
    // If there are high severity flagged items, show red
    if (member.flaggedItems && member.flaggedItems.some(item => item.severity === 'high')) {
      return '#ef4444'; // red
    }
    
    // Check sprint commitment status
    if (member.currentSprint) {
      const { commitedPoints, completedPoints } = member.currentSprint;
      const remainingDays = getSprintTimeRemaining(member);
      const totalDays = 14; // Assuming 2-week sprints
      
      // Calculate expected completion based on time elapsed
      const elapsedPercentage = (totalDays - remainingDays) / totalDays;
      const completedPercentage = completedPoints / commitedPoints;
      
      // Calculate if on pace to finish
      const remainingPoints = commitedPoints - completedPoints;
      const pointsPerDay = completedPoints / (totalDays - remainingDays);
      const canCompleteRemaining = remainingDays * pointsPerDay >= remainingPoints;
      
      // If on pace to finish, show green
      if (canCompleteRemaining) {
        return '#10b981'; // green - on track to finish
      }
      
      // If behind on commitments (less completed than time elapsed would suggest)
      if (completedPercentage < elapsedPercentage * 0.7) {
        return '#ef4444'; // red - significantly behind
      }
      
      // If slightly behind
      if (completedPercentage < elapsedPercentage * 0.9) {
        return '#f59e0b'; // amber - slightly behind
      }
    }
    
    // Default to workload
    if (member.workload >= 80) {
      return '#f59e0b'; // amber
    }
    
    return '#10b981'; // green
  };
  
  // Get team size for a manager
  const getTeamSize = (managerId: string) => {
    return teamMembers.filter(member => member.managerId === managerId).length;
  };
  
  // Get current task for a team member
  const getCurrentTask = (member: TeamMember) => {
    const highPriorityTasks = member.currentTasks.filter(task => task.priority === 'high');
    if (highPriorityTasks.length > 0) {
      return highPriorityTasks[0].name;
    }
    return member.currentTasks.length > 0 ? member.currentTasks[0].name : 'No active tasks';
  };
  
  // Get task priority color
  const getTaskPriorityColor = (member: TeamMember) => {
    const highPriorityTasks = member.currentTasks.filter(task => task.priority === 'high');
    if (highPriorityTasks.length > 0) {
      return '#ef4444'; // red for high priority
    }
    return '#6b7280'; // default gray
  };
  
  // Calculate sprint time remaining in days
  const getSprintTimeRemaining = (member: TeamMember) => {
    if (!member.currentSprint) return 0;
    
    const today = new Date();
    const endDate = new Date(member.currentSprint.endDate);
    const diffTime = Math.max(0, endDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // Calculate committed vs. completed tasks
  const getTaskProgress = (member: TeamMember) => {
    if (!member.currentSprint) return { committed: 0, completed: 0 };
    
    return {
      committed: member.currentSprint.commitedPoints,
      completed: member.currentSprint.completedPoints
    };
  };
  
  // Get progress bar color based on work vs time left
  const getProgressBarColor = (member: TeamMember) => {
    if (!member.currentSprint) return '#3b82f6'; // default blue
    
    const { commitedPoints, completedPoints } = member.currentSprint;
    const remainingDays = getSprintTimeRemaining(member);
    const totalDays = 14; // Assuming 2-week sprints
    
    // Calculate expected completion based on time elapsed
    const elapsedPercentage = (totalDays - remainingDays) / totalDays;
    const completedPercentage = completedPoints / commitedPoints;
    
    // Calculate remaining work vs remaining time
    const remainingPoints = commitedPoints - completedPoints;
    const pointsPerDay = completedPoints / (totalDays - remainingDays || 1); // Avoid division by zero
    const daysNeededToComplete = remainingPoints / pointsPerDay;
    
    // If days needed is more than days remaining, show red
    if (daysNeededToComplete > remainingDays) {
      return '#ef4444'; // red - not enough time left
    }
    
    // If almost done (80% or more)
    if (completedPercentage >= 0.8) {
      return '#22c55e'; // green - almost done
    }
    
    // If on track (completed percentage >= elapsed percentage)
    if (completedPercentage >= elapsedPercentage * 0.9) {
      return '#22c55e'; // green - on track
    }
    
    return '#3b82f6'; // blue - normal progress
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Team Dashboard</h1>
        <p style={{ color: '#6b7280' }}>{isTeamView ? `${currentUser.name}'s Team` : 'Your Direct Reports'} ({directReports.length})</p>
      </div>
      
      {/* Only show the manager card at the top if we're not in team view */}
      {!isTeamView && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '240px',
            padding: '20px', 
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: '#f97316',
              color: 'white',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              YOU
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                backgroundColor: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                {currentUser.avatar}
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>You</h3>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{currentUser.role}</p>
              </div>
            </div>
            <p style={{ 
              color: '#3b82f6', 
              fontSize: '14px',
              fontWeight: '500',
              textAlign: 'center',
              padding: '8px',
              backgroundColor: '#f0f9ff',
              borderRadius: '4px'
            }}>
              {directReports.length} direct reports
            </p>
          </div>
        </div>
      )}
      
      {/* Direct Reports Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        {directReports.map(member => (
          <div key={member.id} style={{ 
            padding: '20px', 
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            position: 'relative'
          }}>
            {member.isManager && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer'
              }}
              onClick={() => onViewTeam(member.id)}
              >
                →
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                backgroundColor: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
                position: 'relative'
              }}>
                {member.avatar}
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(member),
                  border: '2px solid white'
                }} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>{member.name}</h3>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{member.role}</p>
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              {member.isManager && (
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Team Size</p>
                  <p style={{ fontSize: '16px', fontWeight: '600' }}>{getTeamSize(member.id)}</p>
                </div>
              )}
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Current Task</p>
                <p style={{ 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: getTaskPriorityColor(member),
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%'
                }}>
                  {getCurrentTask(member)}
                </p>
              </div>
              
              {member.currentSprint && (
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Sprint Progress</p>
                  
                  {/* Progress bar */}
                  <div style={{ position: 'relative', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '4px' }}>
                    <div style={{ 
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${Math.min(100, (getTaskProgress(member).completed / getTaskProgress(member).committed) * 100)}%`,
                      backgroundColor: getProgressBarColor(member),
                      borderRadius: '4px'
                    }} />
                    {getTaskProgress(member).completed > getTaskProgress(member).committed && (
                      <div style={{ 
                        position: 'absolute',
                        left: '100%',
                        top: 0,
                        height: '100%',
                        width: '2px',
                        backgroundColor: '#000',
                      }} />
                    )}
                  </div>
                  
                  {/* Progress text */}
                  <p style={{ 
                    fontSize: '14px', 
                    fontWeight: '500',
                    color: getProgressBarColor(member)
                  }}>
                    {getTaskProgress(member).completed} of {getTaskProgress(member).committed} points
                    {getSprintTimeRemaining(member) > 0 && (
                      <span style={{ color: '#6b7280', fontWeight: 'normal', marginLeft: '8px' }}>
                        ({getSprintTimeRemaining(member)} days left)
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Department</p>
              <p style={{ 
                fontSize: '14px', 
                fontWeight: '500',
                display: 'inline-block',
                padding: '4px 8px',
                backgroundColor: '#f3f4f6',
                borderRadius: '4px'
              }}>
                {member.department}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamDashboard;
