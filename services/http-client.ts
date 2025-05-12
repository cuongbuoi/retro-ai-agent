/**
 * Base HTTP client for API requests
 */

export class HttpClient {
  private readonly baseUrl: string

  constructor() {
    // Get the base URL from environment variable or use default
    const config = useRuntimeConfig()
    this.baseUrl = config.public.API_URL
  }

  /**
   * Send a regular HTTP request
   * @param path The API endpoint path
   * @param method HTTP method
   * @param data Request payload
   * @param headers Additional headers
   * @returns Promise with the response data
   */
  async request<T>(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }

    if (data) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  /**
   * Send a streaming HTTP request that returns a ReadableStream
   * @param path The API endpoint path
   * @param method HTTP method
   * @param data Request payload
   * @param headers Additional headers
   * @returns Promise with a ReadableStream
   */
  async stream<T>(
    path: string,
    method: 'GET' | 'POST' = 'POST',
    data?: any,
    headers?: Record<string, string>,
    signal?: AbortSignal,
  ): Promise<ReadableStream<T>> {
    const url = `${this.baseUrl}${path}`

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        ...headers,
      },
      signal,
    }

    if (data) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (!response.body) {
      throw new Error('No readable stream available')
    }

    return response.body as ReadableStream<T>
  }
}
