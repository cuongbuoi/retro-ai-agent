<template>
  <dialog ref="modalRef" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box bg-white border-4 border-black pixel-box">
      <h3 class="font-bold text-xl text-pink-600 mb-4">{{ $t('chat.select_agent') }}</h3>
      <div class="grid grid-cols-1 gap-3">
        <div
          v-for="agent in agents"
          :key="agent.id"
          @click="selectAgent(agent.id)"
          class="agent-option flex items-center p-2 border-2 border-gray-300 rounded-lg hover:bg-pink-100 cursor-pointer"
          :class="{ 'border-pink-500 bg-pink-50': agent.id === agentStore.currentAgentId }"
        >
          <div class="flex-1">
            <div class="font-bold text-gray-800">{{ $t(`agents.${agent.id}`) }}</div>
            <div class="text-sm text-gray-600">{{ $t(`agents.${agent.id}Desc`) }}</div>
          </div>
          <div v-if="agent.id === agentStore.currentAgentId" class="text-pink-600 font-bold">✓</div>
        </div>
      </div>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn bg-pink-600 text-white border-2 border-black hover:bg-pink-700">
            {{ $t('chat.close') }}
          </button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button style="opacity: 0; width: 100%; height: 100%">{{ $t('chat.close') }}</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AGENTS } from '~/constants/agents'
import { useAgentStore } from '~/stores/agent'
import { useI18n } from 'vue-i18n'

const modalRef = ref<HTMLDialogElement | null>(null)
const agents = AGENTS
const agentStore = useAgentStore()
const { t } = useI18n()

const emit = defineEmits(['close'])

function selectAgent(agentId: string) {
  agentStore.setCurrentAgent(agentId)
  close()
}

function open() {
  if (modalRef.value) {
    modalRef.value.showModal()
  }
}

function close() {
  if (modalRef.value) {
    modalRef.value.close()
    emit('close')
  }
}

defineExpose({ open, close })
</script>

<style scoped>
.pixel-box {
  box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.2);
}

.agent-option {
  transition: all 0.2s ease;
  position: relative;
  z-index: 20;
}

.agent-option:hover {
  transform: translateY(-2px);
}

.modal-box {
  position: relative;
  z-index: 10;
}

.agent-option::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
</style>
