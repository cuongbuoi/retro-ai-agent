declare module 'vue3-markdown' {
  import { DefineComponent } from 'vue'

  export const VMarkdownView: DefineComponent<{
    content?: string
    class?: string
  }>
}
