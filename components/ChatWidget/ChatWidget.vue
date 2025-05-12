<script setup lang="ts">
import type { Message, User, FileAttachment } from '@/types'
import { nanoid } from 'nanoid'
import { processFileAttachments } from '@/utils/chat'
import { useI18n } from 'vue-i18n'
import { useApiKeysStore } from '~/stores/apiKeys'
import { useAIChat } from '~/composables/useAIChat'
import type { AIChatRequest } from '~/services/ai/ai-chat.service'

// Props
const props = defineProps<{
  agent?: string
}>()

// Get i18n translations
const { t } = useI18n()

// API keys store
const apiKeysStore = useApiKeysStore()

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

// Initialize AI Chat service
const { isLoading, error, sendMessage: sendAIChatMessage } = useAIChat()

// Stop the AI response
function stopAIResponse() {
  // Nếu không có streaming message nhưng vẫn có usersTyping (bot), cũng cần xử lý
  if (!streamingMessage.value && usersTyping.value.length > 0) {
    usersTyping.value = []
    return
  }

  if (!streamingMessage.value) return

  // Cập nhật tin nhắn để chỉ ra rằng nó đã bị dừng
  streamingMessage.value.text += '\n\n' + t('chat.response_stopped')

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

    // Create request payload
    const request: AIChatRequest = {
      messages: messagesForApi.value,
      ...(props.agent && { agent: props.agent }),
      // Add API keys from store if available
      ...(apiKeysStore.geminiApiKey && { apiKey: apiKeysStore.geminiApiKey }),
      ...(apiKeysStore.searchApiKey && { searchApiKey: apiKeysStore.searchApiKey }),
      ...(apiKeysStore.searchEngineId && { searchEngineId: apiKeysStore.searchEngineId }),
    }

    // Use our service instead of direct fetch call
    await sendAIChatMessage(
      request,
      streamingMessage.value,
      abortController.value,
      (updatedMessage) => {
        // Update the streaming message with the latest content
        if (streamingMessage.value) {
          streamingMessage.value = updatedMessage
        } else {
          // If streaming is complete, add the message to the messages array
          messages.value.push(updatedMessage)
        }
      },
      // Add onComplete callback to clear typing indicators
      () => {
        // Clear typing indicators
        usersTyping.value = []

        // Finalize the message if it exists
        if (streamingMessage.value) {
          // Add the final streaming message to the messages array
          const finalMessage = { ...streamingMessage.value }
          messages.value.push(finalMessage)
          // Then clear the streaming message
          streamingMessage.value = null
        }
      },
    )
  } catch (error) {
    console.error('Error fetching AI response:', error)

    // Show error message to the user
    if (streamingMessage.value) {
      streamingMessage.value.text =
        'Error: ' + (error instanceof Error ? error.message : 'Failed to connect to the AI service.')

      // Add the error message to chat history
      const errorMessage = { ...streamingMessage.value }
      messages.value.push(errorMessage)
      streamingMessage.value = null
    }

    // Make sure typing indicators are cleared
    usersTyping.value = []
  }
}

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
      :usersTyping="usersTyping"
      :is-file-processing="isFileProcessing"
      :selectedFiles="selectedFiles"
      :stopAIFunction="handleStopAI"
      @new-message="handleNewMessage"
      @upload-file="openFileSelector"
      @remove-file="removeFile"
      @stop-ai-response="handleStopAI"
    />
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
