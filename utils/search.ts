// Web search utilities for deep research
import { sendSSE } from './ai'

/**
 * Interface for search results
 */
export interface SearchResult {
  title: string
  link: string
  snippet: string
  position: number
}

/**
 * Fetch search results from a search API
 * @param query The search query
 * @param requestApiKey Optional search API key from request
 * @param requestEngineId Optional search engine ID from request
 * @returns Array of search results
 */
export async function fetchSearchResults(
  query: string,
  requestApiKey?: string,
  requestEngineId?: string,
): Promise<SearchResult[]> {
  try {
    const config = useRuntimeConfig()

    // Priority order:
    // 1. API key from request payload (if provided)
    // 2. API key from localStorage (client-side)
    // 3. API key from .env config
    let apiKey = requestApiKey || config.SEARCH_API_KEY
    let engineId = requestEngineId || config.SEARCH_ENGINE_ID

    // Check if we have locally stored keys when running in client
    if (!requestApiKey && process.client) {
      const storedApiKey = localStorage.getItem('searchApiKey')
      if (storedApiKey && storedApiKey.trim() !== '') {
        apiKey = storedApiKey
      }
    }

    if (!requestEngineId && process.client) {
      const storedEngineId = localStorage.getItem('searchEngineId')
      if (storedEngineId && storedEngineId.trim() !== '') {
        engineId = storedEngineId
      }
    }

    if (!apiKey || !engineId) {
      throw new Error('Search API credentials are not configured')
    }

    const url = new URL('https://www.googleapis.com/customsearch/v1')
    url.searchParams.append('key', apiKey.toString())
    url.searchParams.append('cx', engineId.toString())
    url.searchParams.append('q', query)

    const response = await fetch(url.toString())

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Search API error:', response.status, errorData)

      // Check for API key related errors
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        throw new Error('Search API key không hợp lệ hoặc ID tìm kiếm không đúng')
      }

      throw new Error(`Search API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.items || !Array.isArray(data.items)) {
      return []
    }

    return data.items.map((item: any, index: number) => ({
      title: item.title || '',
      link: item.link || '',
      snippet: item.snippet || '',
      position: index + 1,
    }))
  } catch (error: any) {
    console.error('Search error:', error)
    throw error
  }
}

/**
 * Format search results for AI prompt
 * @param results Array of search results
 * @returns Formatted string with search results
 */
export function formatSearchResultsForPrompt(results: SearchResult[]): string {
  if (!results.length) {
    return 'No search results found.'
  }

  const formattedResults = results
    .map((result) => {
      return `[${result.position}] ${result.title}
URL: ${result.link}
Snippet: ${result.snippet}
`
    })
    .join('\n')

  return `Web Search Results:
${formattedResults}
`
}

/**
 * Perform web search and stream results to client
 * @param query The search query
 * @param response The response object for streaming
 * @param requestApiKey Optional search API key from request
 * @param requestEngineId Optional search engine ID from request
 */
export async function performWebSearchAndStream(
  query: string,
  response: any,
  requestApiKey?: string,
  requestEngineId?: string,
): Promise<string> {
  try {
    // Send a message that search is starting
    sendSSE(response, {
      type: 'chunk',
      content: '\n\n[Đang tìm kiếm thông tin liên quan đến "' + query + '"...]\n\n',
    })

    // Fetch search results
    const results = await fetchSearchResults(query, requestApiKey, requestEngineId).catch((error) => {
      // Convert specific error message to Vietnamese
      let errorMessage = error.message || 'Không thể tìm kiếm thông tin'

      // Send error message to client
      sendSSE(response, {
        type: 'chunk',
        content: `\n\n[Lỗi tìm kiếm: ${errorMessage}]\n\n`,
      })

      throw error
    })

    // Format results for the prompt
    const formattedResults = formatSearchResultsForPrompt(results)

    // Send a message that search is complete
    sendSSE(response, {
      type: 'chunk',
      content: '[Tìm kiếm hoàn tất - Đang phân tích...]\n\n',
    })

    return formattedResults
  } catch (error) {
    console.error('Search and stream error:', error)
    return 'Error: Unable to perform web search.'
  }
}
