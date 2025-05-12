<script setup lang="ts">
import { VMarkdownView } from 'vue3-markdown'
import { onMounted, nextTick, watch, ref } from 'vue'
import Prism from 'prismjs'

// Import Prism CSS themes
import 'prismjs/themes/prism.css'
import 'prismjs/themes/prism-okaidia.css' // Monokai-like theme

// Import additional languages in correct order
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
// Required dependency for PHP
import 'prismjs/components/prism-markup-templating'
import 'prismjs/components/prism-php'
// Vue syntax highlighting
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-graphql'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-diff'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-swift'

// Import plugins
import 'prismjs/plugins/toolbar/prism-toolbar.css'
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'
import 'prismjs/plugins/show-language/prism-show-language'

// Define Vue language syntax highlighting
// Sử dụng phương pháp an toàn hơn với TypeScript
;(Prism.languages as any).vue = Prism.languages.extend('markup', {})

// Sử dụng cách tiếp cận an toàn hơn cho TypeScript
const vueLang = (Prism.languages as any).vue
if (vueLang && vueLang.tag && vueLang.tag.inside) {
  const attrValue = vueLang.tag.inside['attr-value']
  if (attrValue && attrValue.inside) {
    attrValue.inside.entity = (Prism.languages.markup as any).entity
    Object.assign(attrValue.inside, Prism.languages.javascript)
  }
}

// Add tokens from CSS
;(Prism.languages as any).vue.style = {
  pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
  lookbehind: true,
  inside: Prism.languages.css,
  alias: 'language-css',
}

// Add tokens from JavaScript for script tags
;(Prism.languages as any).vue.script = {
  pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
  lookbehind: true,
  inside: Prism.languages.javascript,
  alias: 'language-javascript',
}

const props = defineProps<{
  content: string
}>()

const container = ref<HTMLElement | null>(null)

const highlightCode = () => {
  if (container.value) {
    const codeBlocks = container.value.querySelectorAll('pre code')
    if (codeBlocks.length) {
      codeBlocks.forEach((block) => {
        // Get language class
        const classMatch = block.className.match(/language-(\w+)/)
        const language = classMatch ? classMatch[1] : ''

        // Add class to parent pre tag for Prism styling
        const pre = block.parentElement
        if (pre) {
          pre.className = `language-${language}`
        }
      })
      // Trigger Prism highlighting
      Prism.highlightAllUnder(container.value)
    }
  }
}

onMounted(() => {
  nextTick(highlightCode)
})

watch(
  () => props.content,
  () => {
    nextTick(highlightCode)
  },
)
</script>

<template>
  <div ref="container" class="markdown-container">
    <VMarkdownView :content="content" class="!bg-transparent w-full" />
  </div>
</template>

<style>
/* Override PrismJS theme for Monokai style */
:root {
  --prism-background: #272822;
  --prism-comment: #8292a2;
  --prism-foreground: #f8f8f2;
  --prism-keyword: #66d9ef;
  --prism-function: #a6e22e;
  --prism-important: #fd971f;
  --prism-operator: #f8f8f2;
  --prism-property: #f92672;
  --prism-punctuation: #f8f8f2;
  --prism-selector: #a6e22e;
  --prism-string: #a6e22e;
  --prism-number: #ae81ff;
  --prism-class: #a6e22e;
  --prism-tag: #f92672;
  --prism-italic: italic;
  --prism-bold: bold;
}

/* Ensure proper Monokai theme colors */
.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: var(--prism-comment);
}

.token.punctuation {
  color: var(--prism-punctuation);
}

.token.namespace {
  opacity: 0.7;
}

.token.property,
.token.tag,
.token.constant,
.token.symbol,
.token.deleted {
  color: var(--prism-property);
}

.token.boolean,
.token.number {
  color: var(--prism-number);
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
  color: var(--prism-string);
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
  color: var(--prism-operator);
}

.token.atrule,
.token.attr-value,
.token.keyword {
  color: var(--prism-keyword);
}

.token.function,
.token.class-name {
  color: var(--prism-function);
}

.token.regex,
.token.important,
.token.variable {
  color: var(--prism-important);
}

.token.important,
.token.bold {
  font-weight: var(--prism-bold);
}

.token.italic {
  font-style: var(--prism-italic);
}

.token.entity {
  cursor: help;
}
</style>

<style scoped>
.markdown-container {
  width: 100%;
}

/* Additional styling to match app's design */
:deep(pre) {
  margin: 1em 0;
  position: relative;
  overflow: auto;
  border-radius: 4px;
  background-color: var(--prism-background, #272822);
  color: var(--prism-foreground, #f8f8f2);
  font-family: 'SVN-Retron', monospace;
  font-size: 16px;
  padding: 1em;
  border: 2px solid #3e3d32;
}

:deep(code) {
  font-family: 'SVN-Retron', monospace;
  font-size: 16px;
  background-color: transparent;
}

:deep(code:not([class*='language-'])) {
  padding: 0 0.4em;
  margin: 0;
  font-size: 13px;
  background-color: #ffffff;
  border: 1px solid #272822;
  border-radius: 5px;
}

/* Style the copy button and toolbar */
:deep(.toolbar-item button) {
  font-family: 'SVN-Retron', monospace;
  font-size: 12px;
  background-color: #3e3d32;
  color: #f8f8f2;
  border: 1px solid #75715e;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.toolbar-item button:hover) {
  background-color: #75715e;
}

:deep(.token.important),
:deep(.token.bold) {
  font-weight: bold;
}

:deep(.token.italic) {
  font-style: italic;
}
</style>
