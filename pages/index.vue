<script setup>
import { AGENTS } from '~/constants/agents'
const selectedAgent = ref('frontendDeveloperAgent')
</script>

<template>
  <div class="h-screen w-screen flex flex-col overflow-hidden">
    <div class="pixel-header py-2 bg-pink-600 border-b-4 border-black">
      <div class="flex items-center justify-center flex-col">
        <div class="flex items-center justify-center">
          <img src="/images/logo.png" alt="logo" class="w-10 h-10 mr-2" />
          <h1 class="pixel-title text-2xl text-center !mb-1">Retro AI Assistant</h1>
        </div>
        <div class="flex gap-2 items-center justify-center">
          <p class="text-white text-center text-sm">Chọn agent</p>
          <div class="mt-2 flex items-center justify-center">
            <select
              v-model="selectedAgent"
              class="pixel-select px-3 py-1 border-4 border-black bg-white rounded-none text-lg font-pixel cursor-pointer"
            >
              <option v-for="agent in AGENTS" :key="agent.id" :value="agent.id">
                {{ agent.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex overflow-hidden">
      <ChatWidget class="flex-1 flex flex-col" :agent="selectedAgent" />
    </div>
  </div>
</template>

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

.pixel-select {
  image-rendering: pixelated;
  font-size: 12px;
  box-shadow: 2px 2px 0 #000;
  transition: all 0.1s;
}

.pixel-select:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 #000;
}

.pixel-select:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 #000;
}
</style>
