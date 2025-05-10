export interface AgentDefinition {
  id: string
  name: string
  description?: string
}

export const AGENTS: AgentDefinition[] = [
  {
    id: 'deepResearchAgent',
    name: 'Deep Research Expert',
    description: 'Specializes in comprehensive research and information synthesis',
  },
  {
    id: 'productManagerAgent',
    name: 'Product Manager',
    description: 'Handles product requirements and feature planning',
  },
  {
    id: 'frontendDeveloperAgent',
    name: 'Frontend Developer',
    description: 'Specializes in UI/UX implementation and frontend technologies',
  },
  {
    id: 'backendDeveloperAgent',
    name: 'Backend Developer',
    description: 'Focuses on server-side logic and API implementation',
  },
]

// Helper function to get agent by ID
export const getAgentById = (id: string): AgentDefinition | undefined => {
  return AGENTS.find((agent) => agent.id === id)
}

// Type for agent IDs to be used with TypeScript
export type AgentId = (typeof AGENTS)[number]['id']
