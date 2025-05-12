import type { BaseRequest, BaseResponse } from '~/types/api-base'
import { HttpClient } from '~/services/http-client'

/**
 * AI Chat Service
 * Provides functionality for streaming AI chat responses
 */

// AI Chat Request
export interface AIChatRequest extends BaseRequest {
  messages: Array<{
    role: string
    content: string
    fileAttachments?: Array<{
      name: string
      type: string
      content: string
    }>
  }>
  agent?: string
  apiKey?: string
  searchApiKey?: string
  searchEngineId?: string
}

// AI Chat Response
export interface AIChatResponse extends BaseResponse {
  id: string
  content: string
  createdAt: Date
}

// Tạo một instance HttpClient
const httpClient = new HttpClient()

/**
 * Gửi yêu cầu chat đến AI service và trả về stream response
 * @param request Dữ liệu yêu cầu chat
 * @param signal AbortSignal để hủy yêu cầu
 * @returns ReadableStream với response từ AI
 */
export async function sendChatRequest(
  request: AIChatRequest,
  signal?: AbortSignal,
): Promise<ReadableStream<Uint8Array>> {
  try {
    return await httpClient.stream<Uint8Array>('/api/ai', 'POST', request, undefined, signal)
  } catch (error) {
    console.error('Error in AI chat service:', error)
    throw error
  }
}
