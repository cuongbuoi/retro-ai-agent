<script setup lang="ts">
import type { Message, User } from '~/types'
import MarkdownRenderer from '~/components/MarkdownRenderer.vue'

defineProps<{
  message?: Message
  user?: User
  myMessage?: boolean
}>()

// Format file size
function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`
  else if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  else return `${(size / (1024 * 1024)).toFixed(1)} MB`
}
</script>
<template>
  <div
    class="message-container mb-6 font-['SVN-Retron'] flex"
    :class="{
      'justify-end': myMessage,
      'justify-start w-full': !myMessage,
    }"
  >
    <div
      class="flex flex-col"
      :class="{
        'items-end max-w-md': myMessage,
        'items-start w-full': !myMessage,
      }"
    >
      <div class="flex items-center gap-2 mb-2" :class="{ 'flex-row-reverse': myMessage }">
        <div class="w-10 h-10 overflow-hidden pixel-avatar">
          <img :src="user?.avatar" class="w-full h-full object-cover pixelated" />
        </div>
        <div class="flex items-center gap-2">
          <span class="font-normal text-xs text-pink-700">{{ user?.name }}</span>
          <time v-if="message" class="text-xs text-pink-400">{{ useTimeAgo(message?.createdAt).value }}</time>
        </div>
      </div>

      <div
        class="py-3 px-4 pixel-bubble"
        :class="{
          'bg-pink-400 text-white border-pink-500': myMessage,
          'bg-pink-200 text-pink-800 border-pink-300 w-full': !myMessage,
        }"
      >
        <slot>
          <!-- Search indicator -->
          <div v-if="message?.isSearching" class="search-indicator mb-2 flex items-center text-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="mr-1 animate-pulse"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span class="animate-pulse">{{ $t('chat.searching') }}</span>
          </div>

          <ClientOnly>
            <MarkdownRenderer v-if="message?.text" :content="message.text" />
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
      <div class="text-xs text-pink-400 mt-2" v-if="myMessage">[{{ $t('chat.sent') }}]</div>
    </div>
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
  font-size: 16px;
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

/* Speech bubble arrow for my messages (right side) */
.justify-end .pixel-bubble::after {
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

/* Speech bubble arrow for received messages (left side) */
.justify-start .pixel-bubble::after {
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

/* Make text white in the sender's pink message bubbles */
:deep(.bg-pink-400) .markdown-body p {
  @apply text-white;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.search-indicator {
  padding: 4px 8px;
  background: rgba(244, 114, 182, 0.1);
  border-radius: 4px;
  border: 1px dashed #f472b6;
  display: inline-flex;
  align-items: center;
  font-weight: bold;
}
</style>
