<svelte:options runes={true} />

<script lang="ts">
import * as Resizable from "$lib/components/ui/resizable"
import ContentCard from "$lib/components/content_card/ContentCard.svelte"
import { default_template } from "$lib/store/template"

import json from "highlight.js/lib/languages/python"
import "highlight.js/styles/github.css"
import type { HtmlContent, PlotContent, TableContent } from "./types/template"
import Highlighted from "$lib/components/jar/Highlighted.svelte"

type Content = HtmlContent | PlotContent | TableContent
const template = $state(default_template)
const contents = $derived(template.contents)
const contents_string = $derived(JSON.stringify(contents, null, 2))

const handleAdd = (i: number) => {
  const new_content: HtmlContent = { tag: "p", content: "" }
  const s_start = [...contents.slice(0, i + 1)]
  const s_end = [...contents.slice(i + 1)]
  template.contents = [...s_start, new_content, ...s_end]
}

const handleDelete = (i: number) => {
  template.contents = contents.filter((_, j) => i !== j)
}

const handleUp = (i: number) => {
  if (i === 0) return
  const s = [...contents]
  const tmp = s[i]
  s[i] = s[i - 1]
  s[i - 1] = tmp
  template.contents = s
}

const handleDown = (i: number) => {
  if (i === contents.length - 1) return
  const s = [...contents]
  const tmp = s[i]
  s[i] = s[i + 1]
  s[i + 1] = tmp
  template.contents = s
}

</script>

<main class="w-screen h-screen p-0 m-0">
  <Resizable.PaneGroup direction="horizontal" class="border rounded-lg">
    <Resizable.Pane defaultSize={38} minSize={25}>
      <div class="flex flex-col h-full p-6 space-y-4">
        {#each contents as _, i}
          <ContentCard
            bind:content={template.contents[i] as Content}
            onDelete={() => { handleDelete(i) } }
            onAdd={() => { handleAdd(i) } }
            onUp={() => { handleUp(i) } }
            onDown={() => { handleDown(i) } }
          />
        {/each}
      </div>
    </Resizable.Pane>

    <Resizable.Handle withHandle />
    <Resizable.Pane defaultSize={75} collapsible={true} collapsedSize={10}>
      <div class={"h-full p-6"}>
        <Highlighted content={contents_string} language="json" languageFn={json} class="font-editor" />
      </div>
    </Resizable.Pane>
  </Resizable.PaneGroup>
</main>

<style lang="postcss">
:global(.editor-shadow) {
  box-shadow:
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
}
</style>
