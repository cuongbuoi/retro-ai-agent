<script setup lang="ts">
import type { Message, User, FileAttachment } from '@/types'
import { nanoid } from 'nanoid'
import { processSSEData, processStreamChunk, processFileAttachments, readFileAsBase64 } from '@/utils'

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
const abortController = ref<AbortController | null>(null)

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

// Stop the AI response
function stopAIResponse() {
  // Nếu không có streaming message nhưng vẫn có usersTyping (bot), cũng cần xử lý
  if (!streamingMessage.value && usersTyping.value.length > 0) {
    usersTyping.value = []
    return
  }

  if (!streamingMessage.value) return

  // Cập nhật tin nhắn để chỉ ra rằng nó đã bị dừng
  streamingMessage.value.text += '\n\n[Đã dừng trả lời]'

  // Hủy bỏ fetch request đang chạy
  if (abortController.value) {
    abortController.value.abort()
    abortController.value = null
  }

  // Lưu và cập nhật tin nhắn đã dừng
  const finalMessage = { ...streamingMessage.value }
  const index = messages.value.findIndex((m) => streamingMessage.value && m.id === streamingMessage.value.id)

  if (index !== -1) {
    messages.value[index] = finalMessage
  } else {
    messages.value.push(finalMessage)
  }

  // Reset trạng thái
  streamingMessage.value = null
  usersTyping.value = []
}

// Handle file selection
async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  isFileProcessing.value = true
  selectedFiles.value = []

  try {
    selectedFiles.value = await processFileAttachments(input.files)
  } catch (error) {
    console.error('Error processing files:', error)
  } finally {
    isFileProcessing.value = false
  }
}

// Remove a selected file
function removeFile(fileId: string) {
  selectedFiles.value = selectedFiles.value.filter((file) => file.id !== fileId)
}

// Handle new message submission
async function handleNewMessage(message: Message) {
  // Không cho phép gửi tin nhắn mới khi AI đang phản hồi
  if (usersTyping.value.length > 0) return

  // Thêm file đính kèm nếu có
  if (selectedFiles.value.length > 0) {
    message.fileAttachments = [...selectedFiles.value]
    selectedFiles.value = [] // Xóa file đã chọn
  }

  // Thêm tin nhắn người dùng vào chat
  messages.value.push(message)

  // Đánh dấu bot đang phản hồi
  usersTyping.value.push(bot.value)

  // Tạo placeholder cho phản hồi dạng stream
  streamingMessage.value = {
    id: nanoid(),
    userId: bot.value.id,
    createdAt: new Date(),
    text: '',
  }

  try {
    // Tạo AbortController mới cho request này
    abortController.value = new AbortController()

    // Fetch API response dạng stream
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
      signal: abortController.value.signal,
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No readable stream available')

    // Xử lý stream
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const { processedData, remainingBuffer } = processStreamChunk(buffer, decoder, value)
      buffer = remainingBuffer

      // Process all received data chunks
      for (const data of processedData) {
        const updatedMessage = processSSEData(data, streamingMessage.value)

        // Update streaming message if needed
        if (updatedMessage) {
          if (data.type === 'complete') {
            // Replace streaming message with final message
            const index = messages.value.findIndex((m) => streamingMessage.value && m.id === streamingMessage.value.id)

            if (index !== -1) {
              messages.value[index] = updatedMessage
            } else {
              messages.value.push(updatedMessage)
            }

            streamingMessage.value = null
            abortController.value = null
          } else {
            // Update streaming message with new content
            streamingMessage.value = updatedMessage
          }
        }
      }
    }
  } catch (error) {
    // Xử lý lỗi request đang bị hủy
    if (error.name === 'AbortError') {
      // Đã xử lý ở hàm stopAIResponse
      return
    }

    // Xử lý các lỗi khác
    if (streamingMessage.value) {
      streamingMessage.value.text = 'Error: Failed to connect to the AI service.'

      // Hoàn thiện tin nhắn lỗi
      const finalMessage = { ...streamingMessage.value }
      const index = messages.value.findIndex((m) => streamingMessage.value && m.id === streamingMessage.value.id)

      if (index !== -1) {
        messages.value[index] = finalMessage
      } else {
        messages.value.push(finalMessage)
      }

      streamingMessage.value = null
    }
  } finally {
    // Luôn xóa trạng thái typing khi hoàn thành
    usersTyping.value = []
  }
}

// Trigger file input click
function openFileSelector() {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

// Function để cung cấp trực tiếp cho con để gọi thay vì dùng emit
const handleStopAI = () => {
  console.log('=== handleStopAI CALLED FROM DIRECT PROP ===')
  stopAIResponse()
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
      :selectedFiles="selectedFiles"
      @remove-file="removeFile"
      @stop-ai-response="handleStopAI"
      :stopAIFunction="handleStopAI"
    >
    </ChatBox>
  </div>
</template>

<style scoped>
.chat-widget {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
