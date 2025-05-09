// Vercel Edge Runtime to enable streaming
export const runtime = 'edge'
import { GoogleGenAI } from '@google/genai'
import * as agents from '@/agents'
import { getQuery, readBody, setResponseHeaders } from 'h3'

// Types
interface Message {
  role: string
  content: string
  fileAttachments?: Array<{
    name: string
    type: string
    content: string
  }>
}

interface SSEResponse {
  type: 'start' | 'chunk' | 'complete' | 'error'
  content?: string
  error?: string
  message?: any
}

// AI Content Types
interface TextPart {
  text: string
}

interface InlineDataPart {
  inlineData: {
    data: string
    mimeType: string
  }
}

type ContentPart = TextPart | InlineDataPart

interface AIContent {
  role: string
  parts: ContentPart[]
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

    // Process files if present
    const contents = await prepareAIContents(prompt, body.messages)

    // Begin streaming response
    sendSSE(response, { type: 'start' })
    await streamResponse(aiClient, contents, response, isVercel)

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
 * Prepare AI contents with prompt and file parts
 */
async function prepareAIContents(prompt: string, messages: Message[] = []): Promise<AIContent[]> {
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
async function streamResponse(ai: any, contents: AIContent[], response: any, isVercel: boolean) {
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
