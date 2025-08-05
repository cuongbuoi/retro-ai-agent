export interface AgentDefinition {
  id: string
  nameKey: string
  descriptionKey: string
  model: string
}

export const AGENTS: AgentDefinition[] = [
  {
    id: 'deepResearchAgent',
    nameKey: 'agents.deepResearchAgent',
    descriptionKey: 'agents.deepResearchAgentDesc',
    model: 'gemini-2.5-flash',
  },
  {
    id: 'productManagerAgent',
    nameKey: 'agents.productManagerAgent',
    descriptionKey: 'agents.productManagerAgentDesc',
    model: 'gemini-2.5-flash',
  },
  {
    id: 'frontendDeveloperAgent',
    nameKey: 'agents.frontendDeveloperAgent',
    descriptionKey: 'agents.frontendDeveloperAgentDesc',
    model: 'gemini-2.5-flash',
  },
  {
    id: 'backendDeveloperAgent',
    nameKey: 'agents.backendDeveloperAgent',
    descriptionKey: 'agents.backendDeveloperAgentDesc',
    model: 'gemini-2.5-flash',
  },
  {
    id: 'novelistAgent',
    nameKey: 'agents.novelistAgent',
    descriptionKey: 'agents.novelistAgentDesc',
    model: 'gemini-2.5-flash',
  },
]

// Helper function to get agent by ID
export const getAgentById = (id: string): AgentDefinition | undefined => {
  return AGENTS.find((agent) => agent.id === id)
}

// Type for agent IDs to be used with TypeScript
export type AgentId = (typeof AGENTS)[number]['id']
