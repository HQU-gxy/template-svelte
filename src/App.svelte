<svelte:options immutable={true} />

<script lang="ts">
import * as Resizable from "$lib/components/ui/resizable"
import ContentCard from "$lib/components/content_card/ContentCard.svelte"
import { template_store } from "./lib/store/template"
import { tick } from "svelte"
import { get } from "svelte/store"
import { curry, always as constantly, partial } from "ramda"
import type { HtmlContent, PlotContent, TableContent } from "./types/template"

type Content = HtmlContent | PlotContent | TableContent
// https://svelte.dev/repl/1afe59d2c99d4919a34985e34c5913ba?version=3.35.0
$: contents = $template_store.contents
$: contents_string = JSON.stringify(contents, null, 2)

const onAdd = async (i: number) => {
  const new_content: HtmlContent = { tag: "p", content: "" }
  const s_start = [...contents.slice(0, i + 1)]
  const s_end = [...contents.slice(i + 1)]
  contents = [...s_start, new_content, ...s_end]
  $template_store.contents = contents
}

const onDelete = async (i: number) => {
  contents = contents.filter((_, j) => i !== j)
  $template_store.contents = contents
}
// https://github.com/sveltejs/svelte/issues/3455
</script>

<main class="w-screen h-screen p-0 m-0">
  <Resizable.PaneGroup direction="horizontal" class="border rounded-lg">
    <Resizable.Pane defaultSize={38} minSize={25}>
      <div class="flex flex-col h-full p-6">
        {#each contents as content, i}
          <ContentCard
            bind:content
            onDelete={() => onDelete(i)}
            onAdd={() => onAdd(i)}
          />
        {/each}
      </div>
    </Resizable.Pane>

    <Resizable.Handle withHandle />
    <Resizable.Pane defaultSize={75} collapsible={true} collapsedSize={10}>
      <div class={"flex h-full p-6"}>
        <div>
          {#key $template_store.contents}
            {contents_string}
          {/key}
        </div>
        <button
          on:click={() => {
            console.info(get(template_store).contents)
          }}
        >
          Status
        </button>
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
