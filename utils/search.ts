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
 * @returns Array of search results
 */
export async function fetchSearchResults(query: string): Promise<SearchResult[]> {
  try {
    const config = useRuntimeConfig()
    const apiKey = config.SEARCH_API_KEY
    const searchEngineId = config.SEARCH_ENGINE_ID

    if (!apiKey || !searchEngineId) {
      throw new Error('Search API credentials are not configured')
    }

    const url = new URL('https://www.googleapis.com/customsearch/v1')
    url.searchParams.append('key', apiKey.toString())
    url.searchParams.append('cx', searchEngineId.toString())
    url.searchParams.append('q', query)

    const response = await fetch(url.toString())
    if (!response.ok) {
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
  } catch (error) {
    console.error('Search error:', error)
    return []
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
 */
export async function performWebSearchAndStream(query: string, response: any): Promise<string> {
  try {
    // Send a message that search is starting
    sendSSE(response, {
      type: 'chunk',
      content: '\n\n[Đang tìm kiếm thông tin liên quan đến "' + query + '"...]\n\n',
    })

    // Fetch search results
    const results = await fetchSearchResults(query)

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
    sendSSE(response, {
      type: 'chunk',
      content: '\n\n[Lỗi tìm kiếm: Không thể tìm kiếm thông tin]\n\n',
    })
    return 'Error: Unable to perform web search.'
  }
}
