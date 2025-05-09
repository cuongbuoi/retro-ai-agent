<script setup lang="ts">
import type { Message, User, FileAttachment } from '@/types'
import { nanoid } from 'nanoid'

// Props
const props = defineProps<{
  agent?: string
}>()

// Define users
const me = ref<User>({
  id: 'user',
  avatar: '/user.png',
  name: 'Thằng Bảy',
})
const bot = ref<User>({
  id: 'assistant',
  avatar: '/bot.png',
  name: 'Đạt Văn Tây',
})
const users = computed(() => [me.value, bot.value])

// Chat state
const messages = ref<Message[]>([])
const streamingMessage = ref<Message | null>(null)
const usersTyping = ref<User[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFiles = ref<FileAttachment[]>([])
const isFileProcessing = ref(false)

// Format messages for API - only send last 2 messages to reduce payload size
const messagesForApi = computed(() =>
  messages.value
    .map((m) => {
      const message = {
        role: m.userId,
        content: m.text,
      }

      // Add file attachments to the last message if there are any
      if (m === messages.value[messages.value.length - 1] && m.fileAttachments?.length) {
        return {
          ...message,
          fileAttachments: m.fileAttachments.map((file) => ({
            name: file.name,
            type: file.type,
            content: file.content.toString(),
          })),
        }
      }

      return message
    })
    .slice(-2),
)

// Process SSE data events
const processSSEData = (data: any) => {
  switch (data.type) {
    case 'start':
      console.log('Stream started')
      break

    case 'chunk':
      if (streamingMessage.value && data.content) {
        streamingMessage.value.text += data.content
      }
      break

    case 'complete':
      if (data.message?.choices?.[0]?.message) {
        const finalMessage = {
          id: data.message.id || nanoid(),
          userId: bot.value.id,
          createdAt: new Date(),
          text: data.message.choices[0].message.content,
        }

        // Replace streaming message with final message
        const index = messages.value.findIndex((m) => streamingMessage.value && m.id === streamingMessage.value.id)

        if (index !== -1) {
          messages.value[index] = finalMessage
        } else {
          messages.value.push(finalMessage)
        }

        streamingMessage.value = null
      }
      break

    case 'error':
      console.error('Streaming error:', data.error)
      if (streamingMessage.value) {
        streamingMessage.value.text += `\n\nError: ${data.error}`
      }
      break
  }
}

// Process SSE stream chunks
const processStreamChunk = (buffer: string, decoder: TextDecoder, chunk: Uint8Array) => {
  // Append new decoded text to buffer
  const newBuffer = buffer + decoder.decode(chunk, { stream: true })

  // Split buffer into complete messages
  const messageChunks = newBuffer.split('\n\n')

  // Keep the last potentially incomplete chunk in buffer
  const remainingBuffer = messageChunks.pop() || ''

  // Process all complete messages
  for (const messageText of messageChunks) {
    if (messageText.trim() === '') continue

    if (messageText.startsWith('data: ')) {
      try {
        const data = JSON.parse(messageText.substring(6))
        processSSEData(data)
      } catch (e) {
        console.error('Error parsing SSE data:', e)
      }
    }
  }

  return remainingBuffer
}

// Handle file selection
async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  isFileProcessing.value = true
  selectedFiles.value = []

  try {
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i]

      // Process file
      const fileContent = await readFileAsBase64(file)

      selectedFiles.value.push({
        id: nanoid(),
        name: file.name,
        type: file.type,
        size: file.size,
        content: fileContent,
      })
    }
  } catch (error) {
    console.error('Error processing files:', error)
  } finally {
    isFileProcessing.value = false
  }
}

// Read file as base64
function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject

    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file) // Keep the data URL format for images
    } else {
      reader.readAsText(file)
    }
  })
}

// Remove a selected file
function removeFile(fileId: string) {
  selectedFiles.value = selectedFiles.value.filter((file) => file.id !== fileId)
}

// Handle new message submission
async function handleNewMessage(message: Message) {
  // Add file attachments if any
  if (selectedFiles.value.length > 0) {
    message.fileAttachments = [...selectedFiles.value]
    selectedFiles.value = [] // Clear selected files
  }

  // Add user message to chat
  messages.value.push(message)
  usersTyping.value.push(bot.value)

  // Create placeholder for streaming response
  streamingMessage.value = {
    id: nanoid(),
    userId: bot.value.id,
    createdAt: new Date(),
    text: '',
  }

  try {
    // Fetch API response as stream
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({
        messages: messagesForApi.value,
        ...(props.agent && { agent: props.agent }),
      }),
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No readable stream available')

    // Process stream
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer = processStreamChunk(buffer, decoder, value)
    }
  } catch (error) {
    console.error('Streaming request failed:', error)
    if (streamingMessage.value) {
      streamingMessage.value.text = 'Error: Failed to connect to the AI service.'
    }
  } finally {
    usersTyping.value = []
  }
}

// Trigger file input click
function openFileSelector() {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}
</script>
<template>
  <div class="chat-widget h-full flex flex-col">
    <input ref="fileInputRef" type="file" @change="handleFileSelect" class="hidden" multiple />

    <ChatBox
      :me="me"
      :users="users"
      :messages="streamingMessage ? [...messages, streamingMessage] : messages"
      @new-message="handleNewMessage"
      :usersTyping="usersTyping"
      @upload-file="openFileSelector"
      :is-file-processing="isFileProcessing"
    >
      <template #before-messages>
        <div
          v-if="selectedFiles.length > 0"
          class="selected-files p-2 bg-pink-100 rounded pixel-border border-2 border-black mx-2 my-2"
        >
          <p class="text-xs text-pink-700 mb-1">Đã tải lên file:</p>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="file in selectedFiles"
              :key="file.id"
              class="file-badge flex items-center bg-pink-200 px-2 py-1 rounded"
            >
              <span class="text-xs text-pink-700 truncate max-w-[150px]">{{ file.name }}</span>
              <button @click="removeFile(file.id)" class="ml-2 text-pink-700 text-xs leading-none">×</button>
            </div>
          </div>
        </div>
      </template>
    </ChatBox>
  </div>
</template>

<style scoped>
.chat-widget {
  height: 100%;
}

.selected-files {
  image-rendering: pixelated;
}
</style>
