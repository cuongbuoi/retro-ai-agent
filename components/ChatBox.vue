<script setup lang="ts">
import { nanoid } from 'nanoid'
import type { Message, User } from '../types'
import PixelButton from './PixelButton.vue'

const props = withDefaults(
  defineProps<{
    messages: Message[]
    users: User[]
    me: User
    usersTyping?: User[]
  }>(),
  {
    usersTyping: [],
  },
)

const emit = defineEmits<{
  (e: 'newMessage', payload: Message): void
}>()

function getUser(id: string) {
  return props.users.find((user) => user.id === id)
}

const input = ref()

const messageBox = ref()

const sendMessage = () => {
  if (input.value.value) {
    emit('newMessage', {
      id: nanoid(),
      userId: props.me.id,
      createdAt: new Date(),
      text: input.value.value,
    })
    input.value.value = ''
  }
}

watch(
  () => props.messages,
  () => {
    nextTick(() => (messageBox.value.scrollTop = messageBox.value.scrollHeight))
  },
  { deep: true },
)
</script>

<template>
  <div class="h-full w-full">
    <div class="flex flex-col h-full w-full overflow-hidden font-['SVN-Retron'] pixel-chat-container">
      <!-- Header -->
      <header class="bg-pink-400 p-3 flex justify-between items-center pixel-border border-b-4 border-black">
        <h1 class="text-base font-normal text-white px-2 py-1">
          Trò chuyện cùng <span class="text-purple-900 font-bold">Đạt Văn Tây</span>
        </h1>
      </header>
      <!-- Messages -->
      <div class="messages p-4 overflow-y-auto flex-1 bg-pink-50" ref="messageBox">
        <div
          v-if="!messages.length"
          class="flex flex-col gap-5 text-center w-[500px] max-w-full mx-auto my-10 p-5 bg-pink-100 pixel-border border-4 border-black"
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
      </div>
      <!-- Footer -->
      <footer class="p-3 bg-pink-200 pixel-border border-t-4 border-black">
        <div class="h-5 text-xs text-pink-700 mb-1">
          <span v-if="usersTyping.length">
            {{ usersTyping.map((user) => user.name).join(' and ') }}
            {{ usersTyping.length === 1 ? 'is' : 'are' }} typing
          </span>
        </div>
        <form class="flex items-center gap-3" @submit.prevent="sendMessage">
          <input
            ref="input"
            class="input w-full px-3 py-2 bg-pink-50 border-4 pixel-border border-black text-pink-700 focus:outline-none text-sm font-['SVN-Retron'] h-[52px]"
            type="text"
            placeholder="Nhập tin nhắn..."
          />
          <div class="send-button-container">
            <PixelButton text="Gửi" color="pink" size="chat" @click="sendMessage" type="submit" class="send-button" />
          </div>
        </form>
      </footer>
    </div>
  </div>
</template>

<style>
.pixel-chat-container {
  image-rendering: pixelated;
  border: none;
  border-radius: 0;
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
</style>
