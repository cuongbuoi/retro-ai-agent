import { HttpClient } from '~/services/http-client'
import type { BaseRequest, BaseResponse } from '~/types/api-base'

/**
 * Web Search Service
 * Cung cấp chức năng tìm kiếm web
 */

// Web Search Request
export interface WebSearchRequest extends BaseRequest {
  query: string
  apiKey?: string
  engineId?: string
}

// Web Search Response
export interface WebSearchResponse extends BaseResponse {
  results: Array<{
    title: string
    link: string
    snippet: string
  }>
}

// Tạo một instance HttpClient
const httpClient = new HttpClient()

/**
 * Thực hiện tìm kiếm web và trả về kết quả
 * @param request Dữ liệu yêu cầu tìm kiếm
 * @returns Kết quả tìm kiếm
 */
export async function searchWeb(request: WebSearchRequest): Promise<WebSearchResponse> {
  try {
    return await httpClient.request<WebSearchResponse>('/api/search', 'POST', request)
  } catch (error) {
    console.error('Error in web search service:', error)
    throw error
  }
}
