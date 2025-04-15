/**
 * MCP Client
 * 
 * This is the core MCP client that serves as the interface between the LLM and MCP servers.
 * It handles discovery of tools and resources, and manages the communication protocol.
 */

// Tool definition interface
export interface MCPTool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
  execute: (params: Record<string, any>) => Promise<any>;
}

// Resource definition interface
export interface MCPResource {
  uri: string;
  contentType: string;
  description: string;
  read: () => Promise<any>;
}

// Server interface
export interface MCPServer {
  id: string;
  name: string;
  description: string;
  listTools(): MCPTool[];
  listResources(): MCPResource[];
  executeTool(name: string, params: any): Promise<any>;
  readResource(uri: string): Promise<any>;
}

// MCP Client class
export class MCPClient {
  private servers: Map<string, MCPServer> = new Map();
  private tools: Map<string, { server: MCPServer; tool: MCPTool }> = new Map();
  private resources: Map<string, { server: MCPServer; resource: MCPResource }> = new Map();

  /**
   * Registers an MCP server with the client
   */
  public registerServer(server: MCPServer): void {
    // Check if server already exists
    if (this.servers.has(server.id)) {
      console.warn(`Server with ID ${server.id} is already registered. Updating.`);
    }
    
    // Register server
    this.servers.set(server.id, server);
    
    // Discover and register tools
    for (const tool of server.listTools()) {
      this.tools.set(tool.name, { server, tool });
    }
    
    // Discover and register resources
    for (const resource of server.listResources()) {
      this.resources.set(resource.uri, { server, resource });
    }
    
    console.log(`Registered server ${server.name} (${server.id}) with ${server.listTools().length} tools and ${server.listResources().length} resources`);
  }

  /**
   * Unregisters an MCP server
   */
  public unregisterServer(serverId: string): boolean {
    const server = this.servers.get(serverId);
    if (!server) {
      return false;
    }
    
    // Remove server
    this.servers.delete(serverId);
    
    // Remove tools from this server
    Array.from(this.tools.entries()).forEach(([toolName, entry]) => {
      if (entry.server.id === serverId) {
        this.tools.delete(toolName);
      }
    });
    
    // Remove resources from this server
    Array.from(this.resources.entries()).forEach(([resourceUri, entry]) => {
      if (entry.server.id === serverId) {
        this.resources.delete(resourceUri);
      }
    });
    
    return true;
  }

  /**
   * Gets a list of all registered servers
   */
  public getServers(): MCPServer[] {
    return Array.from(this.servers.values());
  }

  /**
   * Gets a server by ID
   */
  public getServer(serverId: string): MCPServer | undefined {
    return this.servers.get(serverId);
  }

  /**
   * Gets a list of all available tools
   */
  public getTools(): { name: string; description: string; parameters: any }[] {
    return Array.from(this.tools.values()).map(entry => ({
      name: entry.tool.name,
      description: entry.tool.description,
      parameters: entry.tool.parameters
    }));
  }

  /**
   * Gets a list of all available resources
   */
  public getResources(): { uri: string; contentType: string; description: string }[] {
    return Array.from(this.resources.values()).map(entry => ({
      uri: entry.resource.uri,
      contentType: entry.resource.contentType,
      description: entry.resource.description
    }));
  }

  /**
   * Executes a tool by name
   */
  public async executeTool(toolName: string, params: any): Promise<any> {
    const entry = this.tools.get(toolName);
    if (!entry) {
      throw new Error(`Tool ${toolName} not found`);
    }
    
    try {
      return await entry.server.executeTool(toolName, params);
    } catch (error) {
      console.error(`Error executing tool ${toolName}:`, error);
      throw error;
    }
  }

  /**
   * Reads a resource by URI
   */
  public async readResource(resourceUri: string): Promise<any> {
    const entry = this.resources.get(resourceUri);
    if (!entry) {
      throw new Error(`Resource ${resourceUri} not found`);
    }
    
    try {
      return await entry.server.readResource(resourceUri);
    } catch (error) {
      console.error(`Error reading resource ${resourceUri}:`, error);
      throw error;
    }
  }
}
