# Vibe Manager

## TL;DR
Vibe Manager is an AI-powered management platform that reduces cognitive load for managers by automating routine tasks, maintaining organizational context, and enabling autonomous decision-making. Built with React, TypeScript, and modern web technologies.

## Core Capabilities

- **Organizational Awareness**: Track team structure, work assignments, and reporting lines
- **Autonomous Operations**: Handle emails, calendar, budget approvals, and daily decisions
- **Status Monitoring**: Real-time dashboards for team progress and risk identification
- **Task Automation**: Meeting prep, status reports, and follow-ups
- **Integration Hub**: Connect with calendars, email, task tools, and communication platforms

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

## Calendar Integration Setup

The Vibe Manager integrates with Google Calendar to provide calendar alerts, meeting insights, and autonomous scheduling capabilities. To set up the integration:

1. **Create OAuth Credentials**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Credentials"
   - Create an OAuth client ID for a Web Application
   - Add `http://localhost:3000/auth/google/callback` as an authorized redirect URI

2. **Configure Environment Variables**:
   - Copy `.env.example` to `.env.local`
   - Add your Google OAuth credentials to `.env.local`:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your_client_id
   REACT_APP_GOOGLE_CLIENT_SECRET=your_client_secret
   ```

3. **Enable Google Calendar API**:
   - In Google Cloud Console, navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API" and enable it for your project

> **Note**: For development purposes, the OAuth credentials are temporarily hardcoded in `src/config/oauth.ts`. In a production environment, always use environment variables for sensitive credentials.

## Project Structure
```
vibemanager/
├── public/              # Static files
├── src/                 # Source files
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── assets/          # Images, fonts, etc.
│   ├── App.tsx          # Main App component
│   └── index.tsx        # Entry point
```

## Development Roadmap

1. **Core UI Framework**: Dashboard layout, team visualization
2. **Integration Framework**: Connect to external systems
3. **Autonomous Capabilities**: Decision engine, task automation

## Available Scripts

- **npm start**: Run development server
- **npm test**: Run tests
- **npm run build**: Create production build

## Model Context Protocol (MCP)

Vibe Manager uses the Model Context Protocol (MCP) architecture to enable LLM-driven autonomous operations. The MCP architecture consists of:

1. **MCP Client**: Core interface between LLMs and MCP servers
2. **MCP Servers**: Specialized servers that expose tools and resources for specific domains (e.g., Calendar MCP Server)
3. **LLM Agents**: Bridge components that allow LLMs to discover and use tools through the MCP protocol

This architecture enables the Vibe Manager to maintain context across different tools and platforms while making autonomous decisions based on available information.

## Technical Stack
- React with TypeScript
- TailwindCSS for styling
- React Router for navigation
- RESTful API design
- JWT authentication

## Learn More
- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
