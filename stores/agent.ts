import { defineStore } from 'pinia'
import { AGENTS, getAgentById } from '~/constants/agents'

export const useAgentStore = defineStore('agent', {
  state: () => {
    // Đọc giá trị từ localStorage khi khởi tạo state
    const savedAgent = process.client ? localStorage.getItem('currentAgentId') : null
    return {
      currentAgentId: savedAgent || AGENTS[0]?.id,
    }
  },
  getters: {
    currentAgent: (state) => getAgentById(state.currentAgentId),
    currentAgentName: (state) => {
      const agent = getAgentById(state.currentAgentId)
      return agent?.name || AGENTS[0]?.name
    },
  },
  actions: {
    setCurrentAgent(agentId: string) {
      this.currentAgentId = agentId
      // Lưu vào localStorage khi thay đổi agent
      if (process.client) {
        localStorage.setItem('currentAgentId', agentId)
      }
    },
  },
})
