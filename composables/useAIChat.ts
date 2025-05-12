import { ref } from 'vue'
import { sendChatRequest, type AIChatRequest } from '~/services/ai/ai-chat.service'
import { processSSEData, processStreamChunk } from '~/utils/chat'
import type { Message } from '~/types'

/**
 * Composable để sử dụng AI chat service
 */
export function useAIChat() {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  /**
   * Gửi yêu cầu chat đến AI service và xử lý response dạng stream
   * @param request Yêu cầu chat
   * @param streamingMessage Message đang streaming hiện tại cần cập nhật
   * @param abortController Để hủy yêu cầu
   * @param onUpdate Callback khi message được cập nhật
   * @param onComplete Callback khi streaming hoàn tất
   */
  async function sendMessage(
    request: AIChatRequest,
    streamingMessage: Message | null,
    abortController: AbortController,
    onUpdate: (message: Message) => void,
    onComplete?: () => void,
  ) {
    isLoading.value = true
    error.value = null

    try {
      // Gửi yêu cầu đến AI service
      const stream = await sendChatRequest(request, abortController.signal)

      // Tạo reader từ stream
      const reader = stream.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      // Xử lý các chunk từ stream
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Xử lý chunk sử dụng utility functions từ utils/chat.ts
        const { processedData, remainingBuffer } = processStreamChunk(buffer, decoder, value)
        buffer = remainingBuffer

        // Xử lý từng data event
        for (const data of processedData) {
          const updatedMessage = processSSEData(data, streamingMessage)
          if (updatedMessage) {
            // Gọi callback update với message đã cập nhật
            onUpdate(updatedMessage)

            // Kiểm tra nếu đây là message hoàn tất
            if (data.type === 'complete') {
              onComplete?.()
            }
          }
        }
      }

      // Đảm bảo onComplete được gọi kể cả khi không nhận được event 'complete'
      onComplete?.()
    } catch (error: any) {
      console.error('Error in AI chat service:', error)
      error.value = error
      onComplete?.()
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    sendMessage,
  }
}
