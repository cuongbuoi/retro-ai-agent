export interface User {
  id: string
  avatar: string
  name: string
}
export interface Message {
  id: string
  userId: string
  createdAt: Date
  text: string
  fileAttachments?: FileAttachment[]
  isSearching?: boolean
}
export interface FileAttachment {
  id: string
  name: string
  type: string
  size: number
  content: string | ArrayBuffer // Base64 encoded content or raw buffer
}
export type AsyncState = null | 'loading' | 'error' | 'complete'
