// Vercel Edge Runtime to enable streaming
export const runtime = 'edge'
import { GoogleGenAI } from '@google/genai'
import * as agents from '@/agents'
import { getQuery, readBody, setResponseHeaders } from 'h3'

// Types
interface Message {
  role: string
  content: string
}

interface SSEResponse {
  type: 'start' | 'chunk' | 'complete' | 'error'
  content?: string
  error?: string
  message?: any
}

// Constants
const MODEL_NAME = 'gemini-2.0-flash'
const DEFAULT_AGENT = 'frontendDeveloperAgent'

/**
 * Main API handler for AI chat functionality
 * Supports streaming responses via Server-Sent Events
 */
export default defineEventHandler(async (event) => {
  // Set up SSE response
  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })

  const response = event.node.res
  const isVercel = process.env.VERCEL === '1'

  try {
    // Parse and validate request
    const body = await parseRequestBody(event)
    if (!body) return

    // Setup agent and AI client
    const agentName = body.agent || DEFAULT_AGENT
    if (!isValidAgent(agentName)) {
      return sendError(response, `Agent '${agentName}' doesn't exist`)
    }

    const aiClient = initializeAIClient()
    const agentConfig = getAgentConfig(agentName, body)
    const prompt = buildPrompt(body.messages || [], agentConfig.messages)

    // Begin streaming response
    sendSSE(response, { type: 'start' })
    await streamResponse(aiClient, prompt, response, isVercel)

    response.end()
  } catch (error: any) {
    sendError(response, error.message || 'Unknown error')
  }
})

// Helper Functions

/**
 * Initialize the AI client with API key
 */
function initializeAIClient() {
  const { GEMINI_API_KEY } = useRuntimeConfig()
  return new GoogleGenAI({ apiKey: GEMINI_API_KEY })
}

/**
 * Send an SSE formatted response
 */
function sendSSE(response: any, data: SSEResponse) {
  response.write(`data: ${JSON.stringify(data)}\n\n`)
}

/**
 * Send an error response and end the connection
 */
function sendError(response: any, error: string) {
  sendSSE(response, { type: 'error', error })
  response.end()
}

/**
 * Check if the requested agent exists
 */
function isValidAgent(agent: string): boolean {
  return Object.keys(agents).includes(agent)
}

/**
 * Get the agent configuration
 */
function getAgentConfig(agentName: string, body: any) {
  // @ts-expect-error - agent validation handled in caller
  return agents[agentName](body)
}

/**
 * Parse request body from either GET or POST method
 */
async function parseRequestBody(event: any) {
  const response = event.node.res
  const method = event.node.req.method

  if (method === 'GET') {
    const query = getQuery(event)
    if (!query.data) {
      sendError(response, 'Missing data parameter')
      return null
    }

    try {
      return JSON.parse(atob(query.data as string))
    } catch (e) {
      sendError(response, 'Invalid data parameter')
      return null
    }
  } else {
    return await readBody(event)
  }
}

/**
 * Create a formatted prompt from messages
 */
function buildPrompt(messages: Message[], agentMessages?: Message[]): string {
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
 * Stream response from the AI model
 */
async function streamResponse(ai: any, prompt: string, response: any, isVercel: boolean) {
  try {
    const streamingResponse = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents: prompt,
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

/**
 * Format the completion message in the expected structure
 */
function formatCompletionMessage(text: string) {
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
