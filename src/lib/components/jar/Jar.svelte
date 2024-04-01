<script lang="ts">
import { CodeJar } from "codejar"
import { onMount } from "svelte"
import hljs from "highlight.js"
import { cn } from "$lib/utils.js"
import python from "highlight.js/lib/languages/python"
import "highlight.js/styles/github.css"
// https://unpkg.com/browse/highlightjs@9.16.2/styles/

let CodeElement: HTMLElement
let editor: CodeJar | null = null

let content = ""
let className = ""

export { className as class, content }

onMount(() => {
  hljs.registerLanguage("python", python)
  CodeElement.innerHTML = hljs.highlight("python", content).value
  editor = CodeJar(CodeElement, (el) => {
    let code = el.textContent
    el.innerHTML = hljs.highlight("python", code ?? "").value
  })
})
// https://svelte.dev/docs/component-directives#style-props
</script>

<code bind:this={CodeElement} class={cn("block", className)}>
  {content}
</code>

<style>
</style>
