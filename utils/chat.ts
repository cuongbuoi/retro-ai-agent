// Chat-related utilities
import type { Message, User, FileAttachment } from '@/types'
import { nanoid } from 'nanoid'

/**
 * Process SSE data events and update streaming message
 */
export function processSSEData(data: any, streamingMessage: Message | null) {
  switch (data.type) {
    case 'start':
      console.log('Stream started')
      break

    case 'chunk':
      if (streamingMessage && data.content) {
        streamingMessage.text += data.content
        return { ...streamingMessage }
      }
      break

    case 'search':
      if (streamingMessage) {
        // Add isSearching flag to the streaming message
        return {
          ...streamingMessage,
          isSearching: true,
        }
      }
      break

    case 'complete':
      if (data.message?.choices?.[0]?.message) {
        return {
          id: data.message.id || nanoid(),
          userId: 'assistant',
          createdAt: new Date(),
          text: data.message.choices[0].message.content,
          isSearching: false,
        }
      }
      break

    case 'error':
      console.error('Streaming error:', data.error)
      if (streamingMessage) {
        streamingMessage.text += `\n\nError: ${data.error}`
        return { ...streamingMessage, isSearching: false }
      }
      break
  }

  return null
}

/**
 * Process SSE stream chunks and extract complete messages
 */
export function processStreamChunk(buffer: string, decoder: TextDecoder, chunk: Uint8Array) {
  // Append new decoded text to buffer
  const newBuffer = buffer + decoder.decode(chunk, { stream: true })

  // Split buffer into complete messages
  const messageChunks = newBuffer.split('\n\n')

  // Keep the last potentially incomplete chunk in buffer
  const remainingBuffer = messageChunks.pop() || ''

  // Process all complete messages
  const processedData = []
  for (const messageText of messageChunks) {
    if (messageText.trim() === '') continue

    if (messageText.startsWith('data: ')) {
      try {
        const data = JSON.parse(messageText.substring(6))
        processedData.push(data)
      } catch (e) {
        console.error('Error parsing SSE data:', e)
      }
    }
  }

  return {
    processedData,
    remainingBuffer,
  }
}

/**
 * Read file as base64 or text
 */
export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject

    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file) // Keep the data URL format for images
    } else {
      reader.readAsText(file)
    }
  })
}

/**
 * Process and prepare file attachments for AI request
 */
export async function processFileAttachments(files: FileList): Promise<FileAttachment[]> {
  const fileAttachments: FileAttachment[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const fileContent = await readFileAsBase64(file)

    fileAttachments.push({
      id: nanoid(),
      name: file.name,
      type: file.type,
      size: file.size,
      content: fileContent,
    })
  }

  return fileAttachments
}

/**
 * Adjust textarea height based on content
 */
export function adjustTextareaHeight(textarea: HTMLTextAreaElement, maxHeight: number = 150) {
  if (!textarea) return

  // Reset height to auto to get the correct scrollHeight
  textarea.style.height = 'auto'

  // Set the height to match content (scrollHeight) up to max height
  const newHeight = Math.min(textarea.scrollHeight, maxHeight)
  textarea.style.height = `${newHeight}px`

  return newHeight
}
