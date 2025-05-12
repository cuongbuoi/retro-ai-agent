import { ref } from 'vue'
import { searchWeb, type WebSearchRequest, type WebSearchResponse } from '~/services/search/web-search.service'

/**
 * Composable để sử dụng dịch vụ tìm kiếm web
 */
export function useWebSearch() {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  /**
   * Gửi yêu cầu tìm kiếm web
   * @param request Yêu cầu tìm kiếm
   * @returns Kết quả tìm kiếm
   */
  async function search(request: WebSearchRequest): Promise<WebSearchResponse | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await searchWeb(request)
      return response
    } catch (error: any) {
      console.error('Error in web search service:', error)
      error.value = error
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    search,
  }
}
