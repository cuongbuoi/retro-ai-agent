/**
 * Utils directory - contains reusable utility functions for the application
 *
 * This file exports all utility functions from the various utility files:
 * - Network utilities (fetchWithTimeout)
 * - AI utilities (from ./ai.ts)
 * - Chat utilities (from ./chat.ts)
 */

import type { NitroFetchOptions } from 'nitropack'

/**
 * Fetch data with a timeout
 * @param url The URL to fetch
 * @param fetchOptions Fetch options
 * @returns The fetched data
 * @throws Error if the request times out
 */
export async function fetchWithTimeout<T>(url: string, fetchOptions: NitroFetchOptions<any, any> = {}): Promise<T> {
  const controller = new AbortController()
  const id = setTimeout(() => {
    controller.abort()
    throw new Error('Request timed out')
  }, 15_000)
  const res = await $fetch<T>(url, {
    ...fetchOptions,
    signal: controller.signal,
  })
  clearTimeout(id)
  return res
}

// Export AI utility functions
export * from './ai'

// Export chat utility functions
export * from './chat'

// Export search utility functions
export * from './search'

// Define file buffer size for attachment processing
export const MAX_FILE_SIZE = 1024 * 1024 * 10 // 10MB
