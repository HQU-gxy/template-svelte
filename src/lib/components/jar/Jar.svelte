<svelte:options runes={true} />

<script lang="ts">
import { CodeJar } from "codejar"
import { tick } from "svelte"
import hljs from "highlight.js"
import { cn } from "$lib/utils.js"
import python from "highlight.js/lib/languages/python"
import "highlight.js/styles/github.css"
// https://unpkg.com/browse/highlightjs@9.16.2/styles/

let CodeElement: HTMLElement
let editor: CodeJar | null = $state(null)

interface Props {
  content: string
  class: string
  onContentChange: (content: string) => void
}

let {
  content = $bindable(),
  class: className,
  onContentChange,
}: Props = $props()

// https://svelte.dev/docs/component-directives#style-props
$effect(() => {
  const language = "python"
  hljs.registerLanguage(language, python)
  CodeElement.innerHTML = hljs.highlight(content, { language }).value
  editor = CodeJar(CodeElement, (el) => {
    ;(async function () {
      const code = el.textContent
      content = code ?? ""
      onContentChange(content)
      el.innerHTML = hljs.highlight(content, { language }).value
    })()
      .then()
      .catch(console.error)
  })
})
</script>

<code bind:this={CodeElement} class={cn("block", className)}></code>

<style>
</style>
