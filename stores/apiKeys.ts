import { defineStore } from 'pinia'

export const useApiKeysStore = defineStore('apiKeys', {
  state: () => {
    // Read values from localStorage when initializing state
    if (process.client) {
      return {
        geminiApiKey: localStorage.getItem('geminiApiKey') || '',
        searchApiKey: localStorage.getItem('searchApiKey') || '',
        searchEngineId: localStorage.getItem('searchEngineId') || '',
      }
    }
    return {
      geminiApiKey: '',
      searchApiKey: '',
      searchEngineId: '',
    }
  },
  actions: {
    setGeminiApiKey(key: string) {
      this.geminiApiKey = key
      if (process.client) {
        localStorage.setItem('geminiApiKey', key)
      }
    },
    setSearchApiKey(key: string) {
      this.searchApiKey = key
      if (process.client) {
        localStorage.setItem('searchApiKey', key)
      }
    },
    setSearchEngineId(id: string) {
      this.searchEngineId = id
      if (process.client) {
        localStorage.setItem('searchEngineId', id)
      }
    },
    resetApiKeys() {
      this.geminiApiKey = ''
      this.searchApiKey = ''
      this.searchEngineId = ''
      if (process.client) {
        localStorage.removeItem('geminiApiKey')
        localStorage.removeItem('searchApiKey')
        localStorage.removeItem('searchEngineId')
      }
    },
  },
})
