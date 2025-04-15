export interface Task {
  id: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'not-started' | 'in-progress' | 'review' | 'completed';
  flagged?: boolean;
  blockers?: string[];
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  commitedPoints: number;
  completedPoints: number;
  remainingPoints: number;
  status: 'on-track' | 'at-risk' | 'behind';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  managerId: string | null;
  isManager: boolean;
  avatar: string;
  directReports: string[]; // IDs of direct reports
  currentTasks: Task[];
  workload: number; // 0-100
  skills: string[];
  currentSprint?: Sprint;
  flaggedItems?: Array<{
    id: string;
    type: 'task' | 'risk' | 'blocker';
    description: string;
    severity: 'high' | 'medium' | 'low';
    createdDate: string;
  }>;
}

export interface Department {
  id: string;
  name: string;
  headId: string;
  headCount: number;
  projects: number;
}
