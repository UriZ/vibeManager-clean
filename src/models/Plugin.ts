export interface PluginMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  icon?: string;
  category: 'integration' | 'automation' | 'monitoring' | 'organization' | 'decision';
  enabled: boolean;
}

export interface PluginConfig {
  settings: Record<string, any>;
  credentials?: Record<string, string>;
}

export interface PluginCapability {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface Plugin {
  metadata: PluginMetadata;
  config: PluginConfig;
  capabilities: PluginCapability[];
  initialize: () => Promise<boolean>;
  terminate: () => Promise<void>;
}

export interface IntegrationPlugin extends Plugin {
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  getData: (params: any) => Promise<any>;
  sendData: (data: any) => Promise<any>;
}

export interface AutomationPlugin extends Plugin {
  executeTask: (taskId: string, params: any) => Promise<any>;
  scheduleTask: (taskDefinition: any, schedule: string) => Promise<string>;
  cancelTask: (taskId: string) => Promise<boolean>;
}

export interface DecisionPlugin extends Plugin {
  evaluateDecision: (context: any, options: any[]) => Promise<{ 
    decision: any, 
    confidence: number, 
    reasoning: string 
  }>;
  recordOutcome: (decisionId: string, outcome: any) => Promise<void>;
  getDecisionHistory: () => Promise<any[]>;
}

export interface PluginRegistry {
  registerPlugin: (plugin: Plugin) => void;
  unregisterPlugin: (pluginId: string) => void;
  getPlugin: (pluginId: string) => Plugin | null;
  getPluginsByCategory: (category: string) => Plugin[];
  getAllPlugins: () => Plugin[];
}
