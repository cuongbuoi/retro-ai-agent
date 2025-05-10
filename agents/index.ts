// register all agent files here
export * from './frontendDeveloperAgent'
export * from './backendDeveloperAgent'
export * from './productManagerAgent'
export * from './deepResearchAgent'
export * from './novelistAgent'

// Import agent types from constants
import type { AgentId } from '~/constants/agents'

// and register types here
export type Agent = AgentId

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
