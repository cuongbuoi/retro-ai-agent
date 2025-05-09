// register all agent files here
export * from './frontendDeveloperAgent'
export * from './backendDeveloperAgent'

// and register types here
export type Agent = 'frontendDeveloperAgent' | 'backendDeveloperAgent'

// Define interfaces for the agent options
export interface RequestOptions {
  messages?: Array<{
    role: string
    content: string
  }>
  temperature?: number
  [key: string]: any
}

// util function for creating trainings with proper typing
export default function createAgent(agent: (context: Record<string, any>) => Partial<RequestOptions>) {
  return agent
}
