<script setup lang="ts">
import { AGENTS } from '~/constants/agents'
import { useAgentStore } from '~/stores/agent'
import { PATHS } from '~/constants/routes'

definePageMeta({
  layout: 'default',
})

const agentStore = useAgentStore()
const agents = AGENTS
const localePath = useLocalePath()
const { t } = useI18n()

const goToChat = (agentId: string) => {
  agentStore.setCurrentAgent(agentId)
  navigateTo(
    localePath({
      name: PATHS.CHAT.name,
    }),
  )
}
</script>

<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-6xl mx-auto mb-12">
          <div v-for="agent in agents" :key="agent.id" class="agent-card">
            <div class="pixel-box bg-white">
              <h2 class="text-xl font-bold mb-2 text-pink-500">{{ t(agent.nameKey) }}</h2>
              <p class="text-gray-600 min-h-[100px] mb-4">{{ t(agent.descriptionKey) }}</p>
              <div class="text-center">
                <PixelButton :text="$t('chat.chat_now')" @click="goToChat(agent.id)" />
              </div>
            </div>
          </div>
        </div>

        <!-- Deep Research Feature -->
        <DeepResearchFeature />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  padding: 20px;
  position: relative;
  z-index: 1;
}

.agent-card {
  transition: transform 0.2s ease;
}

.agent-card:hover {
  transform: translateY(-5px);
}

.pixel-title {
  text-shadow: 3px 3px 0 #f472b6;
  letter-spacing: 1px;
}
</style>
