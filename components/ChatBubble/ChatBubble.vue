<script setup lang="ts">
import { VMarkdownView } from 'vue3-markdown'
import type { Message, User, FileAttachment } from '~/types'

defineProps<{
  message?: Message
  user?: User
  myMessage?: boolean
}>()

const { $isDomAvailable } = useNuxtApp()

// Format file size
function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`
  else if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  else return `${(size / (1024 * 1024)).toFixed(1)} MB`
}
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
        'chat-bubble-end bg-pink-400 text-white border-pink-500': myMessage,
        'chat-bubble-start bg-pink-200 text-pink-800 border-pink-300 max-w-none': !myMessage,
      }"
    >
      <slot>
        <ClientOnly>
          <VMarkdownView :content="message?.text" class="!bg-transparent w-full" />
          <template #fallback>
            <div v-if="message?.text" class="whitespace-pre-wrap">{{ message.text }}</div>
          </template>
        </ClientOnly>

        <!-- File Attachments -->
        <div v-if="message?.fileAttachments?.length" class="file-attachments mt-3 pt-3 border-t border-black/10">
          <p class="text-xs mb-2">{{ message.fileAttachments.length > 1 ? 'Files' : 'File' }}:</p>
          <div class="flex flex-col gap-2">
            <div
              v-for="file in message.fileAttachments"
              :key="file.id"
              class="attachment p-2 rounded border"
              :class="myMessage ? 'border-white/20 bg-pink-500/20' : 'border-pink-300 bg-pink-100'"
            >
              <!-- Images preview -->
              <div v-if="file.type.startsWith('image/')" class="mb-1">
                <img
                  :src="file.content.toString()"
                  :alt="file.name"
                  class="max-w-[200px] max-h-[150px] rounded pixelated"
                />
              </div>

              <!-- File info -->
              <div class="flex items-center text-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="mr-1"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <span class="truncate max-w-[150px]">{{ file.name }}</span>
                <span class="ml-1 opacity-70">({{ formatFileSize(file.size) }})</span>
              </div>
            </div>
          </div>
        </div>
      </slot>
    </div>
    <div class="chat-footer text-xs text-pink-400 mt-2" v-if="myMessage">[Đã gửi]</div>
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

.file-attachments {
  position: relative;
  z-index: 2;
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
  font-size: 16px;
  line-height: 1.5;
}

:deep(li) {
  @apply my-2;
  font-size: 16px;
  line-height: 1.5;
}

:deep(strong) {
  @apply text-pink-500;
}

:deep() > * {
  position: relative;
  z-index: 2;
}

:deep(.chat-bubble-end) .markdown-body p {
  @apply text-white;
}
</style>
