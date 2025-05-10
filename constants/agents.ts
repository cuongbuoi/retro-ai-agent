export interface AgentDefinition {
  id: string
  nameKey: string
  descriptionKey?: string
}

export const AGENTS: AgentDefinition[] = [
  {
    id: 'deepResearchAgent',
    nameKey: 'agents.deepResearchAgent',
    descriptionKey: 'agents.deepResearchAgentDesc',
  },
  {
    id: 'productManagerAgent',
    nameKey: 'agents.productManagerAgent',
    descriptionKey: 'agents.productManagerAgentDesc',
  },
  {
    id: 'frontendDeveloperAgent',
    nameKey: 'agents.frontendDeveloperAgent',
    descriptionKey: 'agents.frontendDeveloperAgentDesc',
  },
  {
    id: 'backendDeveloperAgent',
    nameKey: 'agents.backendDeveloperAgent',
    descriptionKey: 'agents.backendDeveloperAgentDesc',
  },
]

// Helper function to get agent by ID
export const getAgentById = (id: string): AgentDefinition | undefined => {
  return AGENTS.find((agent) => agent.id === id)
}

// Type for agent IDs to be used with TypeScript
export type AgentId = (typeof AGENTS)[number]['id']
