import { frontendDeveloperAgent } from './../../agents/frontendDeveloperAgent'
import { GoogleGenAI } from '@google/genai'
import * as agents from '@/agents'
import { getQuery, readBody, setResponseHeaders, createError } from 'h3'

interface Message {
  role: string
  content: string
}

export default defineEventHandler(async (event) => {
  // Set SSE headers
  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })

  // Create and set up response
  const response = event.node.res

  try {
    // Handle both GET and POST methods
    let body
    const method = event.node.req.method

    if (method === 'GET') {
      // For GET requests (EventSource), extract data from query parameters
      const query = getQuery(event)
      if (query.data) {
        try {
          // Decode base64 data parameter
          body = JSON.parse(atob(query.data as string))
        } catch (e) {
          response.write(
            `data: ${JSON.stringify({
              type: 'error',
              error: 'Invalid data parameter',
            })}\n\n`,
          )
          response.end()
          return
        }
      } else {
        response.write(
          `data: ${JSON.stringify({
            type: 'error',
            error: 'Missing data parameter',
          })}\n\n`,
        )
        response.end()
        return
      }
    } else {
      // For POST requests, read body as usual
      body = await readBody(event)
    }

    const agent = body.agent || 'frontendDeveloperAgent'

    if (!Object.keys(agents).includes(agent)) {
      response.write(
        `data: ${JSON.stringify({
          type: 'error',
          error: `${agent} doesn't exist`,
        })}\n\n`,
      )
      response.end()
      return
    }

    const { GEMINI_API_KEY } = useRuntimeConfig()

    // Initialize the Gemini API client
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY }) as any

    // Get agent configuration
    // @ts-expect-error checking above if the agent exists
    const agentConfig = agents[agent](body)

    // Prepare messages for Gemini format
    const messages: Message[] = body.messages || []

    // Add agent-specific system messages to the beginning if they exist
    let finalMessages = [...messages]
    if (agentConfig.messages) {
      const agentMessages = agentConfig.messages.filter(
        (msg: Message) => !messages.some((m: Message) => m.content === msg.content && m.role === msg.role),
      )
      finalMessages = [...agentMessages, ...messages]
    }

    // Combine all messages into a single prompt for simplicity
    let prompt = ''
    for (const msg of finalMessages) {
      prompt += `${msg.role === 'system' ? 'System: ' : msg.role === 'assistant' ? 'Assistant: ' : 'User: '}${msg.content}\n\n`
    }
    prompt += 'Assistant: '

    // Send start event
    response.write(`data: ${JSON.stringify({ type: 'start' })}\n\n`)

    try {
      // Generate content stream using Gemini API
      const streamingResponse = await ai.models.generateContentStream({
        model: 'gemini-2.0-flash',
        contents: prompt,
      })

      let fullText = ''

      // Process each chunk as it arrives
      for await (const chunk of streamingResponse) {
        if (chunk.text) {
          fullText += chunk.text

          // Send chunk
          response.write(
            `data: ${JSON.stringify({
              type: 'chunk',
              content: chunk.text,
            })}\n\n`,
          )
        }
      }

      // Send complete event
      response.write(
        `data: ${JSON.stringify({
          type: 'complete',
          message: {
            id: Date.now().toString(),
            choices: [
              {
                index: 0,
                message: {
                  role: 'assistant',
                  content: fullText,
                },
                finish_reason: 'stop',
              },
            ],
            usage: {
              prompt_tokens: 0,
              completion_tokens: 0,
              total_tokens: 0,
            },
          },
        })}\n\n`,
      )
    } catch (error: any) {
      // Send error event
      response.write(
        `data: ${JSON.stringify({
          type: 'error',
          error: error.message || 'Unknown error',
        })}\n\n`,
      )
    }

    // End response
    response.end()
  } catch (error: any) {
    // If we have an error before we can start streaming, send as error event
    response.write(
      `data: ${JSON.stringify({
        type: 'error',
        error: error.message || 'Unknown error',
      })}\n\n`,
    )
    response.end()
  }
})
