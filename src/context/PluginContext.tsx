import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Plugin, PluginRegistry, PluginMetadata } from '../models/Plugin';

// Define the context type
interface PluginContextType {
  plugins: Plugin[];
  registerPlugin: (plugin: Plugin) => void;
  unregisterPlugin: (pluginId: string) => void;
  getPlugin: (pluginId: string) => Plugin | null;
  getPluginsByCategory: (category: string) => Plugin[];
  enablePlugin: (pluginId: string) => Promise<boolean>;
  disablePlugin: (pluginId: string) => Promise<boolean>;
  isPluginEnabled: (pluginId: string) => boolean;
}

// Create the context with a default value
const PluginContext = createContext<PluginContextType | undefined>(undefined);

// Plugin registry implementation
class PluginRegistryImpl implements PluginRegistry {
  private plugins: Map<string, Plugin> = new Map();

  registerPlugin(plugin: Plugin): void {
    if (this.plugins.has(plugin.metadata.id)) {
      console.warn(`Plugin with ID ${plugin.metadata.id} is already registered. Overwriting.`);
    }
    this.plugins.set(plugin.metadata.id, plugin);
  }

  unregisterPlugin(pluginId: string): void {
    if (!this.plugins.has(pluginId)) {
      console.warn(`Plugin with ID ${pluginId} is not registered.`);
      return;
    }
    
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      plugin.terminate().catch(err => {
        console.error(`Error terminating plugin ${pluginId}:`, err);
      });
    }
    
    this.plugins.delete(pluginId);
  }

  getPlugin(pluginId: string): Plugin | null {
    return this.plugins.get(pluginId) || null;
  }

  getPluginsByCategory(category: string): Plugin[] {
    return Array.from(this.plugins.values()).filter(
      plugin => plugin.metadata.category === category
    );
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }
}

// Provider component
interface PluginProviderProps {
  children: ReactNode;
}

export const PluginProvider: React.FC<PluginProviderProps> = ({ children }) => {
  const [registry] = useState<PluginRegistry>(new PluginRegistryImpl());
  const [plugins, setPlugins] = useState<Plugin[]>([]);

  // Update plugins state when registry changes
  const updatePlugins = () => {
    setPlugins(registry.getAllPlugins());
  };

  const registerPlugin = (plugin: Plugin) => {
    registry.registerPlugin(plugin);
    updatePlugins();
  };

  const unregisterPlugin = (pluginId: string) => {
    registry.unregisterPlugin(pluginId);
    updatePlugins();
  };

  const getPlugin = (pluginId: string): Plugin | null => {
    return registry.getPlugin(pluginId);
  };

  const getPluginsByCategory = (category: string): Plugin[] => {
    return registry.getPluginsByCategory(category);
  };

  const enablePlugin = async (pluginId: string): Promise<boolean> => {
    const plugin = registry.getPlugin(pluginId);
    if (!plugin) return false;

    try {
      const success = await plugin.initialize();
      if (success) {
        plugin.metadata.enabled = true;
        updatePlugins();
      }
      return success;
    } catch (error) {
      console.error(`Error enabling plugin ${pluginId}:`, error);
      return false;
    }
  };

  const disablePlugin = async (pluginId: string): Promise<boolean> => {
    const plugin = registry.getPlugin(pluginId);
    if (!plugin) return false;

    try {
      await plugin.terminate();
      plugin.metadata.enabled = false;
      updatePlugins();
      return true;
    } catch (error) {
      console.error(`Error disabling plugin ${pluginId}:`, error);
      return false;
    }
  };

  const isPluginEnabled = (pluginId: string): boolean => {
    const plugin = registry.getPlugin(pluginId);
    return plugin ? plugin.metadata.enabled : false;
  };

  const value = {
    plugins,
    registerPlugin,
    unregisterPlugin,
    getPlugin,
    getPluginsByCategory,
    enablePlugin,
    disablePlugin,
    isPluginEnabled
  };

  return (
    <PluginContext.Provider value={value}>
      {children}
    </PluginContext.Provider>
  );
};

// Custom hook to use the plugin context
export const usePlugins = (): PluginContextType => {
  const context = useContext(PluginContext);
  if (context === undefined) {
    throw new Error('usePlugins must be used within a PluginProvider');
  }
  return context;
};
