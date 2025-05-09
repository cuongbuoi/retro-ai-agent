<script setup lang="ts">
import { VMarkdownView } from 'vue3-markdown'
import type { Message, User } from '~/types'

defineProps<{
  message?: Message
  user?: User
  myMessage?: boolean
}>()

const { $isDomAvailable } = useNuxtApp()
</script>
<template>
  <div
    class="chat mb-6 font-['SVN-Retron']"
    :class="{
      'chat-end': myMessage,
      'chat-start': !myMessage,
    }"
  >
    <div class="chat-image avatar">
      <div class="w-10 h-10 overflow-hidden pixel-avatar">
        <img :src="user?.avatar" class="w-full h-full object-cover pixelated" />
      </div>
    </div>
    <div class="chat-header mb-2 flex items-center gap-2">
      <span class="font-normal text-xs text-pink-700">{{ user?.name }}</span>
      <time v-if="message" class="text-xs text-pink-400">{{ useTimeAgo(message?.createdAt).value }}</time>
    </div>
    <div
      class="chat-bubble py-3 px-4 prose prose-sm max-w-md w-full pixel-bubble"
      :class="{
        'bg-pink-400 text-white border-pink-500': myMessage,
        'bg-pink-200 text-pink-800 border-pink-300 max-w-none': !myMessage,
      }"
    >
      <slot>
        <ClientOnly>
          <VMarkdownView :content="message?.text" class="!bg-transparent w-full" />
          <template #fallback>
            <div v-if="message?.text" class="whitespace-pre-wrap">{{ message.text }}</div>
          </template>
        </ClientOnly>
      </slot>
    </div>
    <div class="chat-footer text-xs text-pink-400 mt-2" v-if="myMessage">[SENT]</div>
  </div>
</template>
<style scoped>
.pixelated {
  image-rendering: pixelated;
}

.pixel-avatar {
  border: 3px solid #f472b6;
  border-radius: 4px;
  box-shadow: 3px 3px 0 rgba(244, 114, 182, 0.3);
  position: relative;
  overflow: hidden;
}

.pixel-bubble {
  border: 3px solid;
  border-radius: 4px;
  box-shadow: 4px 4px 0 rgba(244, 114, 182, 0.2);
  position: relative;
  font-size: 0.75rem;
  line-height: 1.5;
}

.pixel-bubble::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

.chat-end .pixel-bubble::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  right: -10px;
  top: 10px;
  background: inherit;
  border-right: 1px solid;
  border-color: inherit;
  clip-path: polygon(0 0, 100% 100%, 0 100%);
}

.chat-start .pixel-bubble::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  left: -10px;
  top: 10px;
  background: inherit;
  border-left: 1px solid;
  border-color: inherit;
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
}

:deep(code) {
  background: #fdf2f8;
  color: #be185d;
  padding: 0 0.4em;
  font-family: 'SVN-Retron', monospace;
  font-size: 14px;
  line-height: 1.5;
  border: 2px solid #fbcfe8;
  border-radius: 3px;
  @apply overflow-x-auto w-full;
}

:deep(pre) {
  @apply bg-pink-50 text-pink-600 overflow-x-auto w-full p-3 my-2;
  font-family: 'SVN-Retron', monospace;
  font-size: 14px;
  border: 2px solid #fbcfe8;
  border-radius: 3px;
}

:deep(a) {
  @apply text-pink-500 underline;
}

:deep(ul),
:deep(ol) {
  @apply pl-5 my-2;
}

:deep(li::marker) {
  @apply text-pink-500;
}

:deep(h1),
:deep(h2),
:deep(h3),
:deep(h4) {
  @apply font-normal my-2;
}

:deep(p) {
  @apply my-3;
  line-height: 1.5;
}

:deep(li) {
  @apply my-2;
}

:deep(strong) {
  @apply text-pink-500;
}

:deep() > * {
  position: relative;
  z-index: 2;
}
</style>
