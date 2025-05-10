<script setup lang="ts">
import { nanoid } from 'nanoid'
import type { Message, User, FileAttachment } from '@/types'
import PixelButton from '@/components/PixelButton/PixelButton.vue'
import { adjustTextareaHeight } from '@/utils'

const props = withDefaults(
  defineProps<{
    messages: Message[]
    users: User[]
    me: User
    usersTyping?: User[]
    isFileProcessing?: boolean
    selectedFiles?: FileAttachment[]
    stopAIFunction?: () => void
  }>(),
  {
    usersTyping: () => [] as User[],
    isFileProcessing: false,
    selectedFiles: () => [] as FileAttachment[],
    stopAIFunction: undefined,
  },
)

const emit = defineEmits<{
  (e: 'newMessage', payload: Message): void
  (e: 'uploadFile'): void
  (e: 'removeFile', fileId: string): void
  (e: 'stopAIResponse'): void
}>()

function getUser(id: string) {
  return props.users.find((user) => user.id === id)
}

const textArea = ref()
const messageBox = ref()

// Check if AI is currently responding
const isAIResponding = computed(() => props.usersTyping.length > 0)

// Override sendMessage to check isAIResponding first
const sendMessage = () => {
  if (isAIResponding.value) {
    return
  }

  const text = textArea.value.value.trim()
  textArea.value.value = text
  if (text) {
    emit('newMessage', {
      id: nanoid(),
      userId: props.me.id,
      createdAt: new Date(),
      text,
    })
    textArea.value.value = ''
    // Reset textarea height
    textArea.value.style.height = 'auto'
  }
}

const handleUploadClick = () => {
  emit('uploadFile')
}

// Handle stop AI response button click
const handleStopAIResponse = () => {
  if (!isAIResponding.value) return

  // Hiệu ứng khi nhấn nút
  const stopButton = document.querySelector('.stop-button')
  if (stopButton) {
    stopButton.classList.add('opacity-50', 'cursor-not-allowed')
  }

  // Ưu tiên dùng function trực tiếp nếu có
  if (props.stopAIFunction) {
    props.stopAIFunction()
  } else {
    emit('stopAIResponse')
  }

  // Trả lại trạng thái nút sau một khoảng thời gian ngắn
  setTimeout(() => {
    if (stopButton) {
      stopButton.classList.remove('opacity-50', 'cursor-not-allowed')
    }
  }, 500)
}

// Track textarea height changes to adjust file panel position
const textareaHeight = ref(52) // Initial minimum height

const onTextareaInput = () => {
  if (!textArea.value) return
  const newHeight = adjustTextareaHeight(textArea.value, 150)
  if (newHeight) {
    textareaHeight.value = newHeight
  }
}

// Handle Enter key to send message, Shift+Enter for new line
const onTextareaKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    if (!e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }
}

// Scroll to bottom of message box when messages change or on mount
const scrollToBottom = () => {
  if (messageBox.value) {
    messageBox.value.scrollTop = messageBox.value.scrollHeight
  }
}

onMounted(() => {
  onTextareaInput()
  scrollToBottom()
})

watch(
  () => props.messages,
  () => {
    nextTick(() => scrollToBottom())
  },
  { deep: true },
)

// Also watch selected files in parent component through message box height changes
watch(
  () => messageBox.value?.scrollHeight,
  () => {
    scrollToBottom()
  },
)

// Nút dừng từ khẩn cấp hoặc trong status bar
const directStopAI = () => {
  if (props.stopAIFunction) {
    props.stopAIFunction()
  } else {
    emit('stopAIResponse')
  }
}
</script>

<template>
  <div class="h-full w-full flex flex-col overflow-hidden">
    <div class="flex flex-col h-full w-full font-['SVN-Retron'] pixel-chat-container">
      <!-- Header -->
      <header
        class="bg-pink-400 p-3 flex justify-between items-center pixel-border border-b-4 border-black sticky top-0 z-10"
      >
        <h1 class="text-base font-normal text-white px-2 py-1">
          {{ $t('chat.chat_with') }} <span class="text-purple-900 font-bold">Đạt Văn Tây</span>
        </h1>
      </header>

      <!-- Messages - use flex-1 to fill available space and ensure scrolling works -->
      <div class="messages overflow-y-auto flex-1 bg-pink-50" ref="messageBox">
        <!-- Slot for file upload display before messages -->
        <slot name="before-messages"></slot>

        <div class="p-4">
          <div
            v-if="!messages.length"
            class="flex flex-col gap-5 text-center w-[500px] max-w-full mx-auto p-5 bg-pink-100 pixel-border border-4 border-black"
          >
            <strong class="text-xl text-pink-500 mt-2">{{ $t('chat.agent_intro') }}</strong>
            <p class="text-base text-pink-700 my-3">{{ $t('chat.agent_description') }}</p>
            <ul class="list-none text-left space-y-4 text-pink-700">
              <li class="flex items-start gap-2">
                <span class="block text-xl">→</span>
                <span class="text-sm">{{ $t('chat.ask_about') }}</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="block text-xl">→</span>
                <span class="text-sm">{{ $t('chat.agent_help') }}</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="block text-xl">→</span>
                <span class="text-sm">{{ $t('chat.file_upload_hint') }}</span>
              </li>
            </ul>
          </div>

          <ChatBubble
            v-for="message in messages"
            :key="message.id"
            :message="message"
            :user="getUser(message.userId)"
            :my-message="message.userId === me.id"
          />

          <ChatBubble v-for="user in usersTyping" :key="user.id" :user="user">
            <AppLoading />
          </ChatBubble>

          <!-- Add extra space at the bottom to improve scrolling -->
          <div class="py-3"></div>
        </div>
      </div>

      <!-- File Attachments Panel - Floating above footer -->
      <div
        v-if="selectedFiles.length > 0"
        :style="`bottom: ${textareaHeight + 18}px`"
        class="file-attachments-panel sticky w-full z-10"
      >
        <div class="selected-files p-2 bg-pink-100 rounded pixel-border border-2 border-black mx-3 mb-0 shadow-lg">
          <div class="flex items-center justify-between mb-1">
            <p class="text-xs text-pink-700">{{ $t('chat.uploaded_files') }}</p>
            <span class="text-xs text-pink-500 font-bold">{{ selectedFiles.length }} {{ $t('chat.file') }}</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="file in selectedFiles"
              :key="file.id"
              class="file-badge flex items-center bg-pink-200 px-2 py-1 rounded"
            >
              <span class="text-xs text-pink-700 truncate max-w-[150px]">{{ file.name }}</span>
              <button
                @click="emit('removeFile', file.id)"
                class="ml-2 text-pink-700 text-xs leading-none hover:text-pink-900"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer - sticky at bottom -->
      <footer class="p-3 bg-pink-200 pixel-border border-t-4 border-black sticky bottom-0 z-10">
        <div class="h-5 text-xs text-pink-700 mb-1">
          <span v-if="isAIResponding">
            {{ usersTyping.map((user) => user.name).join(' và ') }} {{ $t('chat.typing') }}
            <span class="text-xs text-red-600 ml-1">
              ({{ $t('chat.stop_hint') }}
              <button @click="directStopAI" class="underline text-red-700 hover:text-red-900 transition-colors">
                {{ $t('chat.stop') }}</button
              >)
            </span>
          </span>
          <span v-else-if="usersTyping.length">
            {{ usersTyping.map((user) => user.name).join(' và ') }} {{ $t('chat.typing') }}
          </span>
          <span v-else-if="isFileProcessing"> {{ $t('chat.processing_file') }} </span>
        </div>
        <div class="flex items-center gap-3">
          <form class="flex items-center gap-3 flex-1" @submit.prevent="sendMessage">
            <textarea
              ref="textArea"
              class="input w-full px-3 py-2 bg-pink-50 border-4 pixel-border border-black text-pink-700 focus:outline-none text-sm font-['SVN-Retron'] min-h-[52px] max-h-[150px] overflow-y-auto resize-none"
              :placeholder="$t('chat.message_placeholder')"
              rows="1"
              @input="onTextareaInput"
              @keydown="onTextareaKeydown"
              :disabled="isAIResponding"
              :class="{ 'opacity-70 bg-pink-100': isAIResponding }"
            ></textarea>
            <div class="flex gap-4 flex-shrink-0 items-center">
              <transition name="fade" mode="out-in">
                <button
                  v-if="!isAIResponding"
                  type="button"
                  @click="handleUploadClick"
                  class="upload-button w-12 h-12 flex items-center justify-center bg-pink-300 hover:bg-pink-400 transition-colors pixel-border border-4 border-black"
                  title="Upload file"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="square"
                    stroke-linejoin="arcs"
                    class="text-pink-800"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </button>

                <button
                  v-else
                  type="button"
                  @click="handleStopAIResponse"
                  class="stop-button relative w-12 h-12 flex items-center justify-center bg-red-400 hover:bg-red-500 transition-colors pixel-border border-4 border-black"
                  :title="$t('chat.stop_response')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="square"
                    stroke-linejoin="arcs"
                    class="text-white relative z-10"
                  >
                    <rect x="6" y="6" width="12" height="12" />
                  </svg>
                  <div class="absolute inset-0 border-4 border-red-500 animate-ping opacity-30 rounded-none"></div>
                </button>
              </transition>

              <div class="send-button-container">
                <PixelButton
                  :text="isAIResponding ? $t('chat.wait') : $t('chat.send')"
                  :color="isAIResponding ? 'emerald' : 'pink'"
                  size="chat"
                  @click="!isAIResponding && sendMessage()"
                  type="submit"
                  class="send-button"
                  :disabled="isAIResponding"
                />
              </div>
            </div>
          </form>
        </div>
      </footer>
    </div>
  </div>
</template>

<style>
.pixel-chat-container {
  image-rendering: pixelated;
  border: none;
  border-radius: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pixel-border {
  border-style: solid;
  border-width: 4px;
  position: relative;
}

.pixel-border::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  clip-path: polygon(
    0 0,
    10px 0,
    10px 2px,
    calc(100% - 10px) 2px,
    calc(100% - 10px) 0,
    100% 0,
    100% 10px,
    calc(100% - 2px) 10px,
    calc(100% - 2px) calc(100% - 10px)
  );
  pointer-events: none;
}

.messages {
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
}

.messages::-webkit-scrollbar {
  width: 12px;
}

.messages::-webkit-scrollbar-track {
  background: #fce7f3;
}

.messages::-webkit-scrollbar-thumb {
  background-color: #f9a8d4;
  border: 3px solid #fce7f3;
  image-rendering: pixelated;
}

/* Add scrollbar styling for textarea too */
textarea::-webkit-scrollbar {
  width: 8px;
}

textarea::-webkit-scrollbar-track {
  background: #fce7f3;
}

textarea::-webkit-scrollbar-thumb {
  background-color: #f9a8d4;
  border: 2px solid #fce7f3;
  image-rendering: pixelated;
}

.send-button-container {
  display: flex;
  align-items: center;
}

.send-button {
  margin: 0;
}

.send-button :deep(.pixel-button-wrapper) {
  margin: 0;
}

.upload-button {
  image-rendering: pixelated;
}

.file-attachments-panel {
  background-color: rgba(252, 231, 243, 0.95);
  box-shadow: 0 -4px 0 rgba(0, 0, 0, 0.1);
  image-rendering: pixelated;
  transition: all 0.3s ease;
  animation: slide-up 0.3s ease;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.selected-files {
  image-rendering: pixelated;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
}

.file-badge {
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.file-badge:hover {
  background-color: #f8b4d9;
}

.stop-button {
  image-rendering: pixelated;
  position: relative;
  overflow: hidden;
}

.stop-button:active {
  transform: translateY(2px);
}

.stop-button:hover {
  background-color: #f87171;
}

.stop-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.8);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%, -50%);
  transform-origin: 50% 50%;
}

.stop-button:active::after {
  opacity: 1;
  animation: ripple 0.4s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0) translate(-50%, -50%);
    opacity: 0.5;
  }
  100% {
    transform: scale(20, 20) translate(-50%, -50%);
    opacity: 0;
  }
}

.emergency-stop-button {
  font-family: 'SVN-Retron', monospace;
  image-rendering: pixelated;
  border: 4px solid black;
  animation: pulse-emergency 1.5s infinite;
  transition: all 0.2s ease;
  font-size: 18px;
}

.emergency-stop-button:active {
  transform: scale(0.95);
}

@keyframes pulse-emergency {
  0% {
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(220, 38, 38, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
  }
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);
}
</style>
