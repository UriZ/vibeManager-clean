export interface Task {
  id: string;
  name: string;
  description: string;
  assignedTo: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdDate: string;
  estimatedHours: number;
  actualHours?: number;
  blockers?: string[];
  comments?: Array<{
    id: string;
    author: string;
    text: string;
    timestamp: string;
  }>;
  tags?: string[];
  sprintId?: string;
}
