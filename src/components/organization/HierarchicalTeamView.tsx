import React, { useState } from 'react';
import { TeamMember } from '../../models/TeamMember';
import TeamMemberCard from './TeamMemberCard';

interface HierarchicalTeamViewProps {
  teamMembers: TeamMember[];
  currentManagerId: string | null;
}

const HierarchicalTeamView: React.FC<HierarchicalTeamViewProps> = ({ 
  teamMembers,
  currentManagerId
}) => {
  const [expandedManagers, setExpandedManagers] = useState<string[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(currentManagerId);
  
  // Get the current manager
  const currentManager = selectedManagerId 
    ? teamMembers.find(member => member.id === selectedManagerId) 
    : null;
  
  // Get direct reports for the current manager
  const directReports = selectedManagerId 
    ? teamMembers.filter(member => member.managerId === selectedManagerId)
    : teamMembers.filter(member => member.managerId === null);
  
  // Toggle expanded state for a manager
  const toggleManagerExpanded = (managerId: string) => {
    if (expandedManagers.includes(managerId)) {
      setExpandedManagers(expandedManagers.filter(id => id !== managerId));
    } else {
      setExpandedManagers([...expandedManagers, managerId]);
    }
  };
  
  // View a specific manager's team
  const viewManagerTeam = (managerId: string) => {
    setSelectedManagerId(managerId);
  };
  
  // Go back to previous manager
  const goBack = () => {
    if (!selectedManagerId) return;
    
    const manager = teamMembers.find(m => m.id === selectedManagerId);
    if (manager && manager.managerId) {
      setSelectedManagerId(manager.managerId);
    } else {
      setSelectedManagerId(null);
    }
  };
  
  // Get the breadcrumb path to the current manager
  const getBreadcrumbPath = () => {
    if (!selectedManagerId) return [];
    
    const path: TeamMember[] = [];
    let currentId = selectedManagerId;
    
    while (currentId) {
      const manager = teamMembers.find(m => m.id === currentId);
      if (manager) {
        path.unshift(manager);
        currentId = manager.managerId || '';
      } else {
        break;
      }
    }
    
    return path;
  };
  
  // Render breadcrumb navigation
  const renderBreadcrumbs = () => {
    const path = getBreadcrumbPath();
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <button 
          onClick={() => setSelectedManagerId(null)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#4b5563',
            padding: '4px 8px',
            cursor: 'pointer',
            fontWeight: selectedManagerId === null ? 'bold' : 'normal',
            textDecoration: selectedManagerId === null ? 'underline' : 'none'
          }}
        >
          All Managers
        </button>
        
        {path.map((manager, index) => (
          <React.Fragment key={manager.id}>
            <span style={{ margin: '0 8px', color: '#9ca3af' }}>/</span>
            <button 
              onClick={() => setSelectedManagerId(manager.id)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#4b5563',
                padding: '4px 8px',
                cursor: 'pointer',
                fontWeight: index === path.length - 1 ? 'bold' : 'normal',
                textDecoration: index === path.length - 1 ? 'underline' : 'none'
              }}
            >
              {manager.name}
            </button>
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  // Get flagged items count for a team
  const getTeamFlaggedCount = (managerId: string) => {
    let count = 0;
    
    // Get all team members under this manager (direct and indirect)
    const getTeamMembers = (id: string): TeamMember[] => {
      const directs = teamMembers.filter(m => m.managerId === id);
      let allMembers = [...directs];
      
      directs.forEach(direct => {
        if (direct.isManager) {
          allMembers = [...allMembers, ...getTeamMembers(direct.id)];
        }
      });
      
      return allMembers;
    };
    
    const team = getTeamMembers(managerId);
    
    // Count flagged items
    team.forEach(member => {
      if (member.flaggedItems) {
        count += member.flaggedItems.length;
      }
      
      member.currentTasks.forEach(task => {
        if (task.flagged) count++;
      });
    });
    
    return count;
  };
  
  // Render team summary
  const renderTeamSummary = () => {
    if (!currentManager) return null;
    
    const teamSize = teamMembers.filter(m => m.managerId === currentManager.id).length;
    const flaggedCount = getTeamFlaggedCount(currentManager.id);
    
    // Calculate average workload
    const team = teamMembers.filter(m => m.managerId === currentManager.id);
    const avgWorkload = team.length > 0 
      ? team.reduce((sum, member) => sum + member.workload, 0) / team.length 
      : 0;
    
    // Calculate sprint status
    const sprintStatuses = team
      .filter(m => m.currentSprint)
      .map(m => m.currentSprint!.status);
    
    const atRiskCount = sprintStatuses.filter(s => s === 'at-risk').length;
    const behindCount = sprintStatuses.filter(s => s === 'behind').length;
    
    let teamStatus = 'on-track';
    if (behindCount > 0) {
      teamStatus = 'behind';
    } else if (atRiskCount > 0) {
      teamStatus = 'at-risk';
    }
    
    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ 
          padding: '16px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Team Size</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{teamSize}</p>
        </div>
        
        <div style={{ 
          padding: '16px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Avg Workload</h3>
          <p style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: avgWorkload < 50 ? '#10b981' : avgWorkload < 80 ? '#f59e0b' : '#ef4444'
          }}>
            {Math.round(avgWorkload)}%
          </p>
        </div>
        
        <div style={{ 
          padding: '16px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Sprint Status</h3>
          <p style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: 
              teamStatus === 'on-track' ? '#10b981' : 
              teamStatus === 'at-risk' ? '#f59e0b' : '#ef4444'
          }}>
            {teamStatus.replace('-', ' ')}
          </p>
        </div>
        
        <div style={{ 
          padding: '16px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Flagged Items</h3>
          <p style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: flaggedCount > 0 ? '#ef4444' : '#10b981'
          }}>
            {flaggedCount}
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      {renderBreadcrumbs()}
      
      {currentManager && renderTeamSummary()}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {directReports.map(member => (
          <TeamMemberCard 
            key={member.id}
            teamMember={member}
            allTeamMembers={teamMembers}
            onViewTeam={viewManagerTeam}
          />
        ))}
      </div>
    </div>
  );
};

export default HierarchicalTeamView;
