<script lang="ts">
import { CodeJar } from "codejar"
import { onMount } from "svelte"
import hljs from "highlight.js"
import { cn } from "$lib/utils.js"
import python from "highlight.js/lib/languages/python"
import "highlight.js/styles/github.css"
import { tick } from "svelte"
// https://unpkg.com/browse/highlightjs@9.16.2/styles/

let CodeElement: HTMLElement
let editor: CodeJar | null = null

let content = ""
let className = ""

let onContentChange: (content: string) => void = () => {}

export { className as class, content, onContentChange }

// https://svelte.dev/docs/component-directives#style-props
onMount(() => {
  const language = "python"
  hljs.registerLanguage(language, python)
  CodeElement.innerHTML = hljs.highlight(language, content).value
  editor = CodeJar(CodeElement, (el) => {
    ;(async function () {
      let code = el.textContent
      content = code ?? ""
      onContentChange(content)
      el.innerHTML = hljs.highlight(language, code ?? "").value
      await tick()
    })()
  })
})
</script>

<code bind:this={CodeElement} class={cn("block", className)}>
  {content}
</code>

<style>
</style>
