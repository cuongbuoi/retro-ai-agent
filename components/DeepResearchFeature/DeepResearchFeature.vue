<template>
  <div class="deep-research-feature">
    <div class="bg-gray-800 p-4 rounded-lg border-2 border-gray-600 mb-6">
      <h2 class="text-xl mb-2 text-cyan-300 font-pixelated">
        <span class="text-green-400">&#x25B6;</span> {{ t('deepResearch.title') }}
      </h2>
      <p class="text-gray-300 mb-4">
        {{ t('deepResearch.description') }}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-700 p-3 rounded border border-gray-500">
          <h3 class="text-yellow-300 mb-2 font-pixelated">{{ t('deepResearch.feature1_title') }}</h3>
          <p class="text-gray-300 text-sm">
            {{ t('deepResearch.feature1_description') }}
          </p>
        </div>
        <div class="bg-gray-700 p-3 rounded border border-gray-500">
          <h3 class="text-yellow-300 mb-2 font-pixelated">{{ t('deepResearch.feature2_title') }}</h3>
          <p class="text-gray-300 text-sm">{{ t('deepResearch.feature2_description') }}</p>
        </div>
        <div class="bg-gray-700 p-3 rounded border border-gray-500">
          <h3 class="text-yellow-300 mb-2 font-pixelated">{{ t('deepResearch.feature3_title') }}</h3>
          <p class="text-gray-300 text-sm">{{ t('deepResearch.feature3_description') }}</p>
        </div>
        <div class="bg-gray-700 p-3 rounded border border-gray-500">
          <h3 class="text-yellow-300 mb-2 font-pixelated">{{ t('deepResearch.feature4_title') }}</h3>
          <p class="text-gray-300 text-sm">{{ t('deepResearch.feature4_description') }}</p>
        </div>
      </div>
      <div class="mt-4 flex justify-center">
        <PixelButton class="text-green-300" :text="$t('deepResearch.try_button')" @click="goToChat(agents[0].id)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AGENTS } from '~/constants/agents'
import { PATHS } from '~/constants/routes'
import { useWebSearch } from '~/composables/useWebSearch'
import { useApiKeysStore } from '~/stores/apiKeys'
import { useI18n } from 'vue-i18n'
import type { WebSearchRequest } from '~/types/api'

const { t } = useI18n()

const agentStore = useAgentStore()
const agents = AGENTS
const localePath = useLocalePath()

const goToChat = (agentId: string) => {
  agentStore.setCurrentAgent(agentId)
  navigateTo(
    localePath({
      name: PATHS.CHAT.name,
    }),
  )
}
</script>

<style scoped>
.font-pixelated {
  font-family: 'Press Start 2P', 'Courier New', monospace;
  font-size: 0.9em;
}
</style>
