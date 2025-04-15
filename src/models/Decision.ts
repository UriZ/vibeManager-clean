export type DecisionStatus = 'pending' | 'approved' | 'rejected' | 'auto-approved' | 'escalated';
export type DecisionCategory = 'budget' | 'scheduling' | 'communication' | 'task' | 'resource' | 'other';
export type DecisionPriority = 'low' | 'medium' | 'high' | 'critical';
export type DecisionImpact = 'individual' | 'team' | 'department' | 'organization';

export interface DecisionContext {
  userId: string;
  teamId?: string;
  departmentId?: string;
  projectId?: string;
  relatedEntities?: string[];
  metadata: Record<string, any>;
}

export interface DecisionOption {
  id: string;
  description: string;
  impact: {
    description: string;
    scope: DecisionImpact;
    metrics?: Record<string, any>;
  };
  confidence: number; // 0-1
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  category: DecisionCategory;
  priority: DecisionPriority;
  status: DecisionStatus;
  createdAt: string;
  updatedAt: string;
  dueBy?: string;
  context: DecisionContext;
  options: DecisionOption[];
  selectedOption?: string; // ID of the selected option
  reasoning?: string;
  approvedBy?: string;
  rejectedBy?: string;
  escalatedTo?: string;
  autoDecisionThreshold?: number; // 0-1, threshold for auto-approval
  notifyUsers?: string[]; // User IDs to notify about this decision
}

export interface DecisionRule {
  id: string;
  name: string;
  description: string;
  category: DecisionCategory;
  conditions: Array<{
    field: string;
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
    value: any;
  }>;
  action: 'auto_approve' | 'auto_reject' | 'escalate' | 'notify';
  actionParams?: Record<string, any>;
  priority: number; // Order of evaluation
  enabled: boolean;
}

export interface DecisionHistory {
  decisionId: string;
  outcome: 'approved' | 'rejected';
  selectedOption: string;
  timestamp: string;
  feedback?: {
    rating: number; // 1-5
    comments?: string;
  };
}
