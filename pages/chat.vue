<template>
  <div class="h-screen w-screen flex flex-col overflow-hidden">
    <div class="pixel-header py-2 bg-pink-600 border-b-4 border-black">
      <div class="flex items-center justify-between px-4">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center">
            <div
              class="flex items-center justify-center bg-white rounded-md border-2 border-black text-pink-600 text-xs font-bold mr-2 px-2 py-1"
            >
              Quay về
            </div>
          </NuxtLink>
        </div>
        <div class="flex items-center justify-center flex-col">
          <div class="flex items-center justify-center">
            <img src="/images/logo.png" alt="logo" class="w-10 h-10 mr-2" />
            <h1 class="pixel-title text-2xl text-center !mb-1">Retro AI Assistant</h1>
          </div>
        </div>
        <div class="w-10 h-10"><!-- Empty div for balance --></div>
      </div>
      <div class="flex justify-center mt-1">
        <div
          class="agent-badge bg-white px-3 py-1 rounded-full border-2 border-black cursor-pointer"
          @click="openAgentModal"
        >
          <span class="font-bold text-pink-600">{{ agentStore.currentAgentName }}</span>
          <span class="ml-1 text-gray-500">↓</span>
        </div>
      </div>
    </div>

    <div class="flex-1 flex overflow-hidden">
      <ChatWidget class="flex-1 flex flex-col" :agent="agentStore.currentAgentId" />
    </div>

    <!-- Use the AgentSelectorModal component -->
    <AgentSelectorModal ref="agentModalRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAgentStore } from '~/stores/agent'

definePageMeta({
  layout: 'chat',
})

const agentStore = useAgentStore()
const agentModalRef = ref<InstanceType<typeof AgentSelectorModal> | null>(null)

function openAgentModal() {
  if (agentModalRef.value) {
    agentModalRef.value.open()
  }
}
</script>

<style scoped>
.pixel-header {
  position: relative;
  box-shadow: 0 4px 0 rgba(219, 39, 119, 0.3);
  z-index: 10;
}

.pixel-title {
  color: white;
  text-shadow: 2px 2px 0 #9d174d;
  letter-spacing: 1px;
}

.agent-badge {
  box-shadow: 2px 2px 0 #000;
  transition: transform 0.2s ease;
}

.agent-badge:hover {
  transform: scale(1.05);
}
</style>
