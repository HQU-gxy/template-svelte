<svelte:options runes={true} />

<script lang="ts">
import hljs, { type LanguageFn } from "highlight.js"
import "highlight.js/styles/github.css"
import { isNullish, type Nullish } from "utility-types"
import { cn } from "$lib/utils.js"

interface Props {
  content: string
  language: string
  languageFn: LanguageFn
  class?: string
}

const { content, language, languageFn, class: className = "" }: Props = $props()
$effect(() => {
  hljs.registerLanguage(language, languageFn)
  if (isNullish(CodeElement)) {
    return
  }
  CodeElement.innerHTML = hljs.highlight(content, { language }).value
})
let CodeElement: HTMLElement | Nullish = null
</script>

<code bind:this={CodeElement} class={className}></code>
