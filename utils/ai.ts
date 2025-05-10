// AI utility functions
import { GoogleGenAI } from '@google/genai'
import * as agents from '@/agents'

// Types
export interface Message {
  role: string
  content: string
  fileAttachments?: Array<{
    name: string
    type: string
    content: string
  }>
}

export interface SSEResponse {
  type: 'start' | 'chunk' | 'complete' | 'error'
  content?: string
  error?: string
  message?: any
}

// AI Content Types
export interface TextPart {
  text: string
}

export interface InlineDataPart {
  inlineData: {
    data: string
    mimeType: string
  }
}

export type ContentPart = TextPart | InlineDataPart

export interface AIContent {
  role: string
  parts: ContentPart[]
}

// Constants
export const MODEL_NAME = 'gemini-2.0-flash'
export const DEFAULT_AGENT = 'deepResearchAgent'

/**
 * Initialize the AI client with API key
 */
export function initializeAIClient() {
  const config = useRuntimeConfig()
  return new GoogleGenAI({ apiKey: config.GEMINI_API_KEY })
}

/**
 * Prepare AI contents with prompt and file parts
 */
export async function prepareAIContents(prompt: string, messages: Message[] = []): Promise<AIContent[]> {
  // Standard text-only prompt
  const contents: AIContent[] = [{ role: 'user', parts: [{ text: prompt }] }]

  // Check for file attachments in the last message
  const lastMessage = messages[messages.length - 1]
  if (lastMessage?.fileAttachments?.length) {
    // Create a parts array with both text and file data
    const parts: ContentPart[] = [{ text: prompt }]

    // Add each file as a part
    for (const file of lastMessage.fileAttachments) {
      if (file.type.startsWith('image/')) {
        // Handle image files
        parts.push({
          inlineData: {
            data: file.content.toString().replace(/^data:image\/\w+;base64,/, ''),
            mimeType: file.type,
          },
        })
      } else if (file.type === 'application/pdf' || file.type.startsWith('text/')) {
        // Handle text files - add file content to prompt
        parts.push({
          text: `\n\nFile: ${file.name}\nContent:\n${file.content}`,
        })
      }
    }

    // Replace contents with the new parts array
    contents[0].parts = parts
  }

  return contents
}

/**
 * Send an SSE formatted response
 */
export function sendSSE(response: any, data: SSEResponse) {
  response.write(`data: ${JSON.stringify(data)}\n\n`)
}

/**
 * Send an error response and end the connection
 */
export function sendError(response: any, error: string) {
  sendSSE(response, { type: 'error', error })
  response.end()
}

/**
 * Check if the requested agent exists
 */
export function isValidAgent(agent: string): boolean {
  return Object.keys(agents).includes(agent)
}

/**
 * Get the agent configuration
 */
export function getAgentConfig(agentName: string, body: any) {
  // @ts-expect-error - agent validation handled in caller
  return agents[agentName](body)
}

/**
 * Create a formatted prompt from messages
 */
export function buildPrompt(messages: Message[], agentMessages?: Message[]): string {
  // Merge agent system messages with user messages, avoiding duplicates
  const finalMessages = agentMessages
    ? [
        ...agentMessages.filter(
          (msg: Message) => !messages.some((m: Message) => m.content === msg.content && m.role === msg.role),
        ),
        ...messages,
      ]
    : messages

  // Format into a string with role prefixes
  const formattedMessages = finalMessages
    .map((msg) => {
      const prefix = msg.role === 'system' ? 'System: ' : msg.role === 'assistant' ? 'Assistant: ' : 'User: '
      return `${prefix}${msg.content}\n\n`
    })
    .join('')

  return formattedMessages + 'Assistant: '
}

/**
 * Format the completion message in the expected structure
 */
export function formatCompletionMessage(text: string) {
  return {
    id: Date.now().toString(),
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: text,
        },
        finish_reason: 'stop',
      },
    ],
    usage: {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    },
  }
}

/**
 * Stream response from the AI model
 */
export async function streamResponse(ai: any, contents: AIContent[], response: any, isVercel: boolean) {
  try {
    const streamingResponse = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents: contents,
    })

    let fullText = ''

    // Process chunks
    for await (const chunk of streamingResponse) {
      if (chunk.text) {
        fullText += chunk.text

        sendSSE(response, {
          type: 'chunk',
          content: chunk.text,
        })

        // Force flush on non-Vercel environments
        if (!isVercel && typeof (response as any).flush === 'function') {
          ;(response as any).flush()
        }
      }
    }

    // Send completion with full message
    sendSSE(response, {
      type: 'complete',
      message: formatCompletionMessage(fullText),
    })
  } catch (error: any) {
    sendSSE(response, {
      type: 'error',
      error: error.message || 'Unknown error',
    })
  }
}
