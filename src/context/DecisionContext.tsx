import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Decision, DecisionRule, DecisionStatus, DecisionHistory } from '../models/Decision';
import { DecisionEngine } from '../services/DecisionEngine';
import { usePlugins } from './PluginContext';
import { DecisionPlugin } from '../models/Plugin';

// Define the context type
interface DecisionContextType {
  decisions: Decision[];
  pendingDecisions: Decision[];
  createDecision: (decision: Omit<Decision, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Decision;
  approveDecision: (decisionId: string, optionId: string, approvedBy: string, reasoning?: string) => Decision | null;
  rejectDecision: (decisionId: string, rejectedBy: string, reasoning?: string) => Decision | null;
  getDecisionsByStatus: (status: DecisionStatus) => Decision[];
  addRule: (rule: Omit<DecisionRule, 'id'>) => DecisionRule;
  removeRule: (ruleId: string) => boolean;
  decisionHistory: DecisionHistory[];
  provideFeedback: (historyId: string, rating: number, comments?: string) => boolean;
}

// Create the context with a default value
const DecisionContext = createContext<DecisionContextType | undefined>(undefined);

// Provider component
interface DecisionProviderProps {
  children: ReactNode;
}

export const DecisionProvider: React.FC<DecisionProviderProps> = ({ children }) => {
  const { plugins } = usePlugins();
  const [engine, setEngine] = useState<DecisionEngine | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [decisionHistory, setDecisionHistory] = useState<DecisionHistory[]>([]);

  // Initialize the decision engine
  useEffect(() => {
    // Filter for decision plugins
    const decisionPlugins = plugins.filter(
      p => p.metadata.category === 'decision' && p.metadata.enabled
    ) as DecisionPlugin[];
    
    const newEngine = new DecisionEngine(decisionPlugins);
    setEngine(newEngine);
    
    // Add some sample decisions for testing
    const sampleDecisions = createSampleDecisions();
    sampleDecisions.forEach(d => newEngine.createDecision(d));
    
    // Add some sample rules
    const sampleRules = createSampleRules();
    sampleRules.forEach(r => newEngine.addRule(r));
    
    // Update state
    setDecisions(newEngine.getAllDecisions());
    setDecisionHistory(newEngine.getDecisionHistory());
  }, [plugins]);

  // Update decisions when engine changes
  useEffect(() => {
    if (!engine) return;
    
    // Set up a periodic refresh
    const interval = setInterval(() => {
      setDecisions(engine.getAllDecisions());
      setDecisionHistory(engine.getDecisionHistory());
    }, 5000);
    
    return () => clearInterval(interval);
  }, [engine]);

  // Create a new decision
  const createDecision = (decision: Omit<Decision, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Decision => {
    if (!engine) throw new Error('Decision engine not initialized');
    
    const newDecision = engine.createDecision(decision);
    setDecisions(engine.getAllDecisions());
    return newDecision;
  };

  // Approve a decision
  const approveDecision = (decisionId: string, optionId: string, approvedBy: string, reasoning?: string): Decision | null => {
    if (!engine) return null;
    
    const result = engine.approveDecision(decisionId, optionId, approvedBy, reasoning);
    if (result) {
      setDecisions(engine.getAllDecisions());
      setDecisionHistory(engine.getDecisionHistory());
    }
    return result;
  };

  // Reject a decision
  const rejectDecision = (decisionId: string, rejectedBy: string, reasoning?: string): Decision | null => {
    if (!engine) return null;
    
    const result = engine.rejectDecision(decisionId, rejectedBy, reasoning);
    if (result) {
      setDecisions(engine.getAllDecisions());
      setDecisionHistory(engine.getDecisionHistory());
    }
    return result;
  };

  // Get decisions by status
  const getDecisionsByStatus = (status: DecisionStatus): Decision[] => {
    if (!engine) return [];
    return engine.getDecisionsByStatus(status);
  };

  // Add a decision rule
  const addRule = (rule: Omit<DecisionRule, 'id'>): DecisionRule => {
    if (!engine) throw new Error('Decision engine not initialized');
    
    const newRule = engine.addRule(rule);
    // Rules might affect decisions, so refresh
    setDecisions(engine.getAllDecisions());
    return newRule;
  };

  // Remove a rule
  const removeRule = (ruleId: string): boolean => {
    if (!engine) return false;
    
    const result = engine.removeRule(ruleId);
    if (result) {
      // Rules might affect decisions, so refresh
      setDecisions(engine.getAllDecisions());
    }
    return result;
  };

  // Provide feedback on a decision
  const provideFeedback = (historyId: string, rating: number, comments?: string): boolean => {
    if (!engine) return false;
    
    const result = engine.provideFeedback(historyId, rating, comments);
    if (result) {
      setDecisionHistory(engine.getDecisionHistory());
    }
    return result;
  };

  // Compute pending decisions
  const pendingDecisions = decisions.filter(d => d.status === 'pending');

  const value = {
    decisions,
    pendingDecisions,
    createDecision,
    approveDecision,
    rejectDecision,
    getDecisionsByStatus,
    addRule,
    removeRule,
    decisionHistory,
    provideFeedback
  };

  return (
    <DecisionContext.Provider value={value}>
      {children}
    </DecisionContext.Provider>
  );
};

// Custom hook to use the decision context
export const useDecisions = (): DecisionContextType => {
  const context = useContext(DecisionContext);
  if (context === undefined) {
    throw new Error('useDecisions must be used within a DecisionProvider');
  }
  return context;
};

// Helper function to create sample decisions
function createSampleDecisions(): Array<Omit<Decision, 'id' | 'createdAt' | 'updatedAt' | 'status'>> {
  return [
    {
      title: 'Office Supplies Budget Approval',
      description: 'Request for $250 to purchase office supplies for the engineering team',
      category: 'budget',
      priority: 'medium',
      context: {
        userId: 'user',
        departmentId: 'd1',
        metadata: {
          amount: 250,
          currency: 'USD',
          purpose: 'Office supplies',
          requestedBy: 'Alex Johnson'
        }
      },
      options: [
        {
          id: 'approve',
          description: 'Approve the budget request',
          impact: {
            description: 'Will allow the team to purchase necessary supplies',
            scope: 'team',
            metrics: {
              budget: -250
            }
          },
          confidence: 0.9
        },
        {
          id: 'reject',
          description: 'Reject the budget request',
          impact: {
            description: 'Team will need to wait for supplies or find alternatives',
            scope: 'team'
          },
          confidence: 0.1
        }
      ],
      autoDecisionThreshold: 0.8
    },
    {
      title: 'Team Meeting Rescheduling',
      description: 'Weekly team sync needs to be rescheduled due to conflicts',
      category: 'scheduling',
      priority: 'medium',
      context: {
        userId: 'user',
        teamId: 'engineering',
        metadata: {
          currentTime: 'Wednesday 10:00 AM',
          proposedTime: 'Thursday 2:00 PM',
          attendees: ['m1', 'dev1', 'dev2', 'dev3', 'ic1']
        }
      },
      options: [
        {
          id: 'reschedule',
          description: 'Reschedule to Thursday 2:00 PM',
          impact: {
            description: 'All team members can attend',
            scope: 'team'
          },
          confidence: 0.85
        },
        {
          id: 'keep',
          description: 'Keep the current schedule',
          impact: {
            description: 'Some team members will miss the meeting',
            scope: 'team'
          },
          confidence: 0.15
        }
      ],
      autoDecisionThreshold: 0.8
    },
    {
      title: 'New Hire Equipment Purchase',
      description: 'Request to purchase a laptop for new team member',
      category: 'budget',
      priority: 'high',
      context: {
        userId: 'user',
        departmentId: 'd1',
        metadata: {
          amount: 1800,
          currency: 'USD',
          purpose: 'New hire laptop',
          requestedBy: 'Emily Rodriguez',
          forEmployee: 'New Designer'
        }
      },
      options: [
        {
          id: 'approve',
          description: 'Approve the equipment purchase',
          impact: {
            description: 'New hire will have necessary equipment',
            scope: 'individual',
            metrics: {
              budget: -1800
            }
          },
          confidence: 0.7
        },
        {
          id: 'alternative',
          description: 'Provide a refurbished laptop',
          impact: {
            description: 'Save budget but may not meet all requirements',
            scope: 'individual',
            metrics: {
              budget: -800
            }
          },
          confidence: 0.2
        },
        {
          id: 'reject',
          description: 'Reject the purchase request',
          impact: {
            description: 'New hire will not have necessary equipment',
            scope: 'individual'
          },
          confidence: 0.1
        }
      ],
      autoDecisionThreshold: 0.8
    }
  ];
}

// Helper function to create sample rules
function createSampleRules(): Array<Omit<DecisionRule, 'id'>> {
  return [
    {
      name: 'Auto-approve small budget requests',
      description: 'Automatically approve budget requests under $500',
      category: 'budget',
      conditions: [
        {
          field: 'context.metadata.amount',
          operator: 'less_than',
          value: 500
        }
      ],
      action: 'auto_approve',
      actionParams: {
        optionId: 'approve',
        reasoning: 'Auto-approved as amount is under $500 threshold'
      },
      priority: 10,
      enabled: true
    },
    {
      name: 'Escalate large budget requests',
      description: 'Escalate budget requests over $1000 to department head',
      category: 'budget',
      conditions: [
        {
          field: 'context.metadata.amount',
          operator: 'greater_than',
          value: 1000
        }
      ],
      action: 'escalate',
      actionParams: {
        escalateTo: 'user',
        reasoning: 'Escalated as amount exceeds $1000 threshold'
      },
      priority: 5,
      enabled: true
    },
    {
      name: 'Auto-approve meeting reschedules with high confidence',
      description: 'Automatically approve meeting reschedules if confidence is high',
      category: 'scheduling',
      conditions: [
        {
          field: 'options.0.confidence',
          operator: 'greater_than',
          value: 0.8
        }
      ],
      action: 'auto_approve',
      actionParams: {
        optionId: 'reschedule',
        reasoning: 'Auto-approved as confidence in reschedule option is high'
      },
      priority: 20,
      enabled: true
    }
  ];
}
