import { Decision, DecisionRule, DecisionStatus, DecisionHistory, DecisionOption } from '../models/Decision';
import { DecisionPlugin } from '../models/Plugin';

export class DecisionEngine {
  private decisions: Map<string, Decision> = new Map();
  private rules: DecisionRule[] = [];
  private history: DecisionHistory[] = [];
  private decisionPlugins: DecisionPlugin[] = [];

  constructor(plugins: DecisionPlugin[] = []) {
    this.decisionPlugins = plugins;
  }

  // Register a decision plugin
  registerPlugin(plugin: DecisionPlugin): void {
    this.decisionPlugins.push(plugin);
  }

  // Unregister a decision plugin
  unregisterPlugin(pluginId: string): void {
    this.decisionPlugins = this.decisionPlugins.filter(p => p.metadata.id !== pluginId);
  }

  // Create a new decision
  createDecision(decision: Omit<Decision, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Decision {
    const id = `decision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const newDecision: Decision = {
      ...decision,
      id,
      createdAt: now,
      updatedAt: now,
      status: 'pending'
    };
    
    this.decisions.set(id, newDecision);
    this.evaluateDecision(id);
    
    return newDecision;
  }

  // Get a decision by ID
  getDecision(id: string): Decision | undefined {
    return this.decisions.get(id);
  }

  // Get all decisions
  getAllDecisions(): Decision[] {
    return Array.from(this.decisions.values());
  }

  // Get decisions by status
  getDecisionsByStatus(status: DecisionStatus): Decision[] {
    return Array.from(this.decisions.values()).filter(d => d.status === status);
  }

  // Update a decision
  updateDecision(id: string, updates: Partial<Omit<Decision, 'id' | 'createdAt'>>): Decision | null {
    const decision = this.decisions.get(id);
    if (!decision) return null;
    
    const updatedDecision: Decision = {
      ...decision,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.decisions.set(id, updatedDecision);
    return updatedDecision;
  }

  // Add a decision rule
  addRule(rule: Omit<DecisionRule, 'id'>): DecisionRule {
    const id = `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newRule: DecisionRule = { ...rule, id };
    
    this.rules.push(newRule);
    // Sort rules by priority
    this.rules.sort((a, b) => a.priority - b.priority);
    
    return newRule;
  }

  // Remove a rule
  removeRule(id: string): boolean {
    const initialLength = this.rules.length;
    this.rules = this.rules.filter(r => r.id !== id);
    return initialLength !== this.rules.length;
  }

  // Evaluate a decision against rules
  private evaluateDecision(decisionId: string): void {
    const decision = this.decisions.get(decisionId);
    if (!decision) return;
    
    // Skip if not pending
    if (decision.status !== 'pending') return;
    
    // Apply rules in priority order
    for (const rule of this.rules) {
      if (!rule.enabled) continue;
      
      // Skip rules that don't match the decision category
      if (rule.category !== decision.category && rule.category !== 'other') continue;
      
      // Check if all conditions match
      const conditionsMatch = rule.conditions.every(condition => {
        const fieldValue = this.getFieldValue(decision, condition.field);
        
        switch (condition.operator) {
          case 'equals':
            return fieldValue === condition.value;
          case 'not_equals':
            return fieldValue !== condition.value;
          case 'greater_than':
            return fieldValue > condition.value;
          case 'less_than':
            return fieldValue < condition.value;
          case 'contains':
            return Array.isArray(fieldValue) ? 
              fieldValue.includes(condition.value) : 
              String(fieldValue).includes(String(condition.value));
          case 'not_contains':
            return Array.isArray(fieldValue) ? 
              !fieldValue.includes(condition.value) : 
              !String(fieldValue).includes(String(condition.value));
          default:
            return false;
        }
      });
      
      if (conditionsMatch) {
        this.applyRuleAction(decision, rule);
        break; // Stop after first matching rule
      }
    }
    
    // If still pending and has auto-decision threshold, check if we can auto-decide
    if (decision.status === 'pending' && decision.autoDecisionThreshold !== undefined) {
      this.attemptAutoDecision(decision);
    }
  }

  // Helper to get a field value from a decision using dot notation
  private getFieldValue(obj: any, field: string): any {
    return field.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
  }

  // Apply a rule action to a decision
  private applyRuleAction(decision: Decision, rule: DecisionRule): void {
    switch (rule.action) {
      case 'auto_approve':
        if (decision.options.length > 0) {
          const selectedOptionId = rule.actionParams?.optionId || decision.options[0].id;
          this.updateDecision(decision.id, {
            status: 'auto-approved',
            selectedOption: selectedOptionId,
            reasoning: rule.actionParams?.reasoning || `Auto-approved by rule: ${rule.name}`
          });
        }
        break;
        
      case 'auto_reject':
        this.updateDecision(decision.id, {
          status: 'rejected',
          reasoning: rule.actionParams?.reasoning || `Auto-rejected by rule: ${rule.name}`
        });
        break;
        
      case 'escalate':
        this.updateDecision(decision.id, {
          status: 'escalated',
          escalatedTo: rule.actionParams?.escalateTo,
          reasoning: rule.actionParams?.reasoning || `Escalated by rule: ${rule.name}`
        });
        break;
        
      case 'notify':
        this.updateDecision(decision.id, {
          notifyUsers: rule.actionParams?.notifyUsers || []
        });
        break;
    }
  }

  // Attempt to make an automatic decision based on confidence
  private async attemptAutoDecision(decision: Decision): Promise<void> {
    if (!decision.options || decision.options.length === 0) return;
    
    // If we have decision plugins, use them to evaluate
    if (this.decisionPlugins.length > 0) {
      try {
        // Use the first enabled plugin for now
        const plugin = this.decisionPlugins.find(p => p.metadata.enabled);
        if (plugin) {
          const result = await plugin.evaluateDecision(
            decision.context,
            decision.options
          );
          
          if (result.confidence >= (decision.autoDecisionThreshold || 0.8)) {
            const selectedOption = decision.options.find(o => o.id === result.decision);
            
            if (selectedOption) {
              this.updateDecision(decision.id, {
                status: 'auto-approved',
                selectedOption: selectedOption.id,
                reasoning: result.reasoning || 'Auto-approved by decision engine'
              });
              
              // Record in history
              this.recordDecisionOutcome(decision.id, 'approved', selectedOption.id);
            }
          }
        }
      } catch (error) {
        console.error('Error using decision plugin:', error);
      }
    } else {
      // Simple fallback: choose option with highest confidence if above threshold
      const highestConfidenceOption = decision.options.reduce(
        (prev, current) => (current.confidence > prev.confidence ? current : prev),
        decision.options[0]
      );
      
      if (highestConfidenceOption.confidence >= (decision.autoDecisionThreshold || 0.8)) {
        this.updateDecision(decision.id, {
          status: 'auto-approved',
          selectedOption: highestConfidenceOption.id,
          reasoning: 'Auto-approved based on confidence score'
        });
        
        // Record in history
        this.recordDecisionOutcome(decision.id, 'approved', highestConfidenceOption.id);
      }
    }
  }

  // Manually approve a decision
  approveDecision(decisionId: string, optionId: string, approvedBy: string, reasoning?: string): Decision | null {
    const decision = this.decisions.get(decisionId);
    if (!decision) return null;
    
    const option = decision.options.find(o => o.id === optionId);
    if (!option) return null;
    
    const updatedDecision = this.updateDecision(decisionId, {
      status: 'approved',
      selectedOption: optionId,
      approvedBy,
      reasoning: reasoning || 'Manually approved'
    });
    
    if (updatedDecision) {
      this.recordDecisionOutcome(decisionId, 'approved', optionId);
    }
    
    return updatedDecision;
  }

  // Manually reject a decision
  rejectDecision(decisionId: string, rejectedBy: string, reasoning?: string): Decision | null {
    const decision = this.decisions.get(decisionId);
    if (!decision) return null;
    
    const updatedDecision = this.updateDecision(decisionId, {
      status: 'rejected',
      rejectedBy,
      reasoning: reasoning || 'Manually rejected'
    });
    
    if (updatedDecision) {
      this.recordDecisionOutcome(decisionId, 'rejected', '');
    }
    
    return updatedDecision;
  }

  // Record a decision outcome in history
  private recordDecisionOutcome(decisionId: string, outcome: 'approved' | 'rejected', selectedOption: string): void {
    const historyEntry: DecisionHistory = {
      decisionId,
      outcome,
      selectedOption,
      timestamp: new Date().toISOString()
    };
    
    this.history.push(historyEntry);
    
    // Also record in plugins if available
    this.decisionPlugins.forEach(plugin => {
      if (plugin.metadata.enabled) {
        plugin.recordOutcome(decisionId, { outcome, selectedOption }).catch(err => {
          console.error(`Error recording outcome in plugin ${plugin.metadata.id}:`, err);
        });
      }
    });
  }

  // Get decision history
  getDecisionHistory(): DecisionHistory[] {
    return [...this.history];
  }

  // Get decision history for a specific decision
  getDecisionHistoryForDecision(decisionId: string): DecisionHistory[] {
    return this.history.filter(h => h.decisionId === decisionId);
  }

  // Provide feedback on a decision
  provideFeedback(historyId: string, rating: number, comments?: string): boolean {
    const historyEntry = this.history.find(h => h.decisionId === historyId);
    if (!historyEntry) return false;
    
    historyEntry.feedback = { rating, comments };
    return true;
  }
}
