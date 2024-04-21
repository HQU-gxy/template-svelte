<svelte:options runes={true} />

<script lang="ts">
import * as Resizable from "$lib/components/ui/resizable"
import ContentCard from "$lib/components/content/ContentCard.svelte"
import { default_template } from "$lib/template/template"
import type { HtmlContent, PlotContent, TableContent } from "./lib/types/template"
import type { Content } from "$lib/types/derived"

import json from "highlight.js/lib/languages/python"
import Highlighted from "$lib/components/jar/Highlighted.svelte"
import "highlight.js/styles/github.css"
import VariableTables from "$lib/components/variables/VariableTables.svelte"

const template = $state(default_template)
const contents = $derived(template.contents)
const template_string = $derived(JSON.stringify(template, null, 2))

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
      <!-- content bar -->
      <div class="flex flex-col h-full p-6 space-y-4 overflow-y-auto">
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
      <!-- display (source code & render result) -->
      <Resizable.PaneGroup direction="vertical" class="border rounded-lg">
      <Resizable.Pane defaultSize={75} collapsible={true} collapsedSize={10}>
        <div class="h-full p-6 overflow-y-auto">
          <Highlighted content={template_string} language="json" languageFn={json} class="font-editor" />
        </div>
      </Resizable.Pane>
    <Resizable.Handle withHandle />
      <!-- variable stuff -->
      <Resizable.Pane defaultSize={25} collapsible={true} collapsedSize={10}>
        <VariableTables bind:variables={template.variables} class="h-full p-6" />
      </Resizable.Pane>
      </Resizable.PaneGroup>
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
