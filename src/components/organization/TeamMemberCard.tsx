import React, { useState } from 'react';
import { TeamMember, Task } from '../../models/TeamMember';

interface TeamMemberCardProps {
  teamMember: TeamMember;
  allTeamMembers: TeamMember[];
  level?: number;
  onViewTeam?: (managerId: string) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  teamMember, 
  allTeamMembers, 
  level = 0,
  onViewTeam
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Get direct reports for this team member
  const directReports = allTeamMembers.filter(member => 
    teamMember.directReports.includes(member.id)
  );
  
  // Get workload color based on percentage
  const getWorkloadColor = (workload: number) => {
    if (workload < 50) return '#10b981'; // green
    if (workload < 80) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };
  
  // Get sprint status color
  const getSprintStatusColor = (status: string) => {
    if (status === 'on-track') return '#10b981'; // green
    if (status === 'at-risk') return '#f59e0b'; // amber
    return '#ef4444'; // red
  };
  
  // Render tasks with priority indicators
  const renderTasks = (tasks: Task[]) => {
    return tasks.map(task => (
      <div key={task.id} style={{ 
        padding: '8px 12px', 
        marginBottom: '8px', 
        backgroundColor: task.priority === 'high' ? '#fee2e2' : task.priority === 'medium' ? '#fef3c7' : '#ecfdf5',
        borderRadius: '4px',
        fontSize: '14px',
        border: task.flagged ? '1px solid #ef4444' : 'none'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {task.flagged && (
              <span style={{ 
                color: '#ef4444', 
                marginRight: '6px', 
                fontWeight: 'bold',
                fontSize: '16px'
              }}>⚠️</span>
            )}
            <span style={{ fontWeight: '500' }}>{task.name}</span>
          </div>
          <span style={{ 
            fontSize: '12px', 
            padding: '2px 6px', 
            borderRadius: '9999px',
            backgroundColor: 
              task.status === 'completed' ? '#d1fae5' : 
              task.status === 'review' ? '#dbeafe' : 
              task.status === 'in-progress' ? '#fef3c7' : '#f3f4f6',
            color: 
              task.status === 'completed' ? '#065f46' : 
              task.status === 'review' ? '#1e40af' : 
              task.status === 'in-progress' ? '#92400e' : '#1f2937'
          }}>
            {task.status.replace('-', ' ')}
          </span>
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
          Due: {task.dueDate}
        </div>
        {task.blockers && task.blockers.length > 0 && (
          <div style={{ 
            fontSize: '12px', 
            color: '#ef4444', 
            marginTop: '4px',
            padding: '4px',
            backgroundColor: '#fee2e2',
            borderRadius: '4px'
          }}>
            <strong>Blockers:</strong> {task.blockers.join(', ')}
          </div>
        )}
      </div>
    ));
  };
  
  // Render sprint status
  const renderSprintStatus = () => {
    if (!teamMember.currentSprint) return null;
    
    const sprint = teamMember.currentSprint;
    const progressPercentage = (sprint.completedPoints / sprint.commitedPoints) * 100;
    
    return (
      <div style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Sprint: {sprint.name}</span>
          <span style={{ 
            fontSize: '12px', 
            padding: '2px 6px', 
            borderRadius: '9999px',
            backgroundColor: 
              sprint.status === 'on-track' ? '#d1fae5' : 
              sprint.status === 'at-risk' ? '#fef3c7' : '#fee2e2',
            color: 
              sprint.status === 'on-track' ? '#065f46' : 
              sprint.status === 'at-risk' ? '#92400e' : '#b91c1c'
          }}>
            {sprint.status}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
          <span>Progress: {sprint.completedPoints} / {sprint.commitedPoints} points</span>
          <span>Remaining: {sprint.remainingPoints} points</span>
        </div>
        <div style={{ 
          height: '8px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '9999px', 
          overflow: 'hidden' 
        }}>
          <div style={{ 
            height: '100%', 
            width: `${progressPercentage}%`, 
            backgroundColor: getSprintStatusColor(sprint.status) 
          }} />
        </div>
      </div>
    );
  };
  
  // Render flagged items
  const renderFlaggedItems = () => {
    if (!teamMember.flaggedItems || teamMember.flaggedItems.length === 0) return null;
    
    return (
      <div style={{ marginTop: '16px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#b91c1c' }}>
          Flagged Items ({teamMember.flaggedItems.length})
        </h4>
        {teamMember.flaggedItems.map(item => (
          <div key={item.id} style={{ 
            padding: '8px 12px', 
            marginBottom: '8px', 
            backgroundColor: '#fee2e2',
            borderRadius: '4px',
            fontSize: '14px',
            border: '1px solid #ef4444'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '500' }}>{item.description}</span>
              <span style={{ 
                fontSize: '12px', 
                padding: '2px 6px', 
                borderRadius: '9999px',
                backgroundColor: '#f3f4f6',
                color: '#1f2937'
              }}>
                {item.type}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              Created: {item.createdDate}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div style={{ 
      border: '1px solid #e5e7eb', 
      borderRadius: '8px', 
      padding: '16px',
      marginLeft: `${level * 20}px`,
      backgroundColor: teamMember.isManager ? '#f0f9ff' : 'white'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '50%', 
          backgroundColor: teamMember.isManager ? '#3b82f6' : '#4f46e5', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '600',
          fontSize: '16px',
          marginRight: '16px'
        }}>
          {teamMember.avatar}
        </div>
        <div style={{ flex: '1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{teamMember.name}</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ 
                fontSize: '12px', 
                padding: '4px 8px', 
                backgroundColor: '#f3f4f6', 
                borderRadius: '9999px',
                color: '#4b5563'
              }}>
                {teamMember.department}
              </span>
              {teamMember.isManager && (
                <span style={{ 
                  fontSize: '12px', 
                  padding: '4px 8px', 
                  backgroundColor: '#dbeafe', 
                  borderRadius: '9999px',
                  color: '#1e40af'
                }}>
                  Manager
                </span>
              )}
            </div>
          </div>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{teamMember.role}</p>
          
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Current Workload</span>
              <span style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: getWorkloadColor(teamMember.workload)
              }}>
                {teamMember.workload}%
              </span>
            </div>
            <div style={{ 
              height: '8px', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '9999px', 
              overflow: 'hidden' 
            }}>
              <div style={{ 
                height: '100%', 
                width: `${teamMember.workload}%`, 
                backgroundColor: getWorkloadColor(teamMember.workload) 
              }} />
            </div>
          </div>
          
          {renderSprintStatus()}
          
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Current Tasks</h4>
            {renderTasks(teamMember.currentTasks)}
          </div>
          
          {renderFlaggedItems()}
          
          {teamMember.isManager && directReports.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '500' }}>Team ({directReports.length})</h4>
                <button 
                  onClick={() => onViewTeam && onViewTeam(teamMember.id)}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  View Team
                </button>
              </div>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px',
                marginTop: '8px'
              }}>
                {directReports.map(report => (
                  <div key={report.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px 8px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      backgroundColor: report.isManager ? '#3b82f6' : '#4f46e5',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '10px',
                      marginRight: '8px'
                    }}>
                      {report.avatar}
                    </div>
                    <span>{report.name}</span>
                    {report.flaggedItems && report.flaggedItems.length > 0 && (
                      <span style={{ 
                        color: '#ef4444', 
                        marginLeft: '4px', 
                        fontWeight: 'bold' 
                      }}>
                        ⚠️
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
