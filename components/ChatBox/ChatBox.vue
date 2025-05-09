<script setup lang="ts">
import { nanoid } from 'nanoid'
import type { Message, User } from '@/types'
import PixelButton from '@/components/PixelButton/PixelButton.vue'

const props = withDefaults(
  defineProps<{
    messages: Message[]
    users: User[]
    me: User
    usersTyping?: User[]
    isFileProcessing?: boolean
  }>(),
  {
    usersTyping: () => [] as User[],
    isFileProcessing: false,
  },
)

const emit = defineEmits<{
  (e: 'newMessage', payload: Message): void
  (e: 'uploadFile'): void
}>()

function getUser(id: string) {
  return props.users.find((user) => user.id === id)
}

const textArea = ref()
const messageBox = ref()

const sendMessage = () => {
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

const adjustTextareaHeight = () => {
  const textarea = textArea.value
  if (!textarea) return

  // Reset height to auto to get the correct scrollHeight
  textarea.style.height = 'auto'

  // Set the height to match content (scrollHeight) up to max height
  const maxHeight = 150 // maximum height in pixels
  const newHeight = Math.min(textarea.scrollHeight, maxHeight)
  textarea.style.height = `${newHeight}px`
}

// Handle textarea input to adjust height
const onTextareaInput = () => {
  adjustTextareaHeight()
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
  adjustTextareaHeight()
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
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <div class="flex flex-col h-full w-full font-['SVN-Retron'] pixel-chat-container">
      <!-- Header -->
      <header
        class="bg-pink-400 p-3 flex justify-between items-center pixel-border border-b-4 border-black sticky top-0 z-10"
      >
        <h1 class="text-base font-normal text-white px-2 py-1">
          Tán gẫu cùng <span class="text-purple-900 font-bold">Đạt Văn Tây</span>
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
            <strong class="text-xl text-pink-500 mt-2">Tao là Đạt Văn Tây!</strong>
            <p class="text-base text-pink-700 my-3">Tao là Giáo sư, cái nồi gì tao cũng biết</p>
            <ul class="list-none text-left space-y-4 text-pink-700">
              <li class="flex items-start gap-2">
                <span class="block text-xl">→</span>
                <span class="text-sm"
                  >Hỏi vài câu về lập trình, các dự án mà mày đang làm, các vấn đề mà mày đang gặp phải, ...</span
                >
              </li>
              <li class="flex items-start gap-2">
                <span class="block text-xl">→</span>
                <span class="text-sm">Đạt Văn Tây sẽ trả lời mày một cách dễ hiểu và chi tiết nhất.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="block text-xl">→</span>
                <span class="text-sm">Gửi file để Đạt Văn Tây phân tích và giúp mày hiểu nội dung.</span>
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

      <!-- Footer - sticky at bottom -->
      <footer class="p-3 bg-pink-200 pixel-border border-t-4 border-black sticky bottom-0 z-10">
        <div class="h-5 text-xs text-pink-700 mb-1">
          <span v-if="usersTyping.length">
            {{ usersTyping.map((user) => user.name).join(' và ') }} đang nhập tin nhắn...
          </span>
          <span v-else-if="isFileProcessing"> Đang xử lý file... </span>
        </div>
        <div class="flex items-center gap-3">
          <form class="flex items-center gap-3 flex-1" @submit.prevent="sendMessage">
            <textarea
              ref="textArea"
              class="input w-full px-3 py-2 bg-pink-50 border-4 pixel-border border-black text-pink-700 focus:outline-none text-sm font-['SVN-Retron'] min-h-[52px] max-h-[150px] overflow-y-auto resize-none"
              placeholder="Nhập tin nhắn..."
              rows="1"
              @input="onTextareaInput"
              @keydown="onTextareaKeydown"
            ></textarea>
            <div class="flex gap-4 flex-shrink-0 items-center">
              <button
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
              <div class="send-button-container">
                <PixelButton
                  text="Gửi"
                  color="pink"
                  size="chat"
                  @click="sendMessage"
                  type="submit"
                  class="send-button"
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
</style>
