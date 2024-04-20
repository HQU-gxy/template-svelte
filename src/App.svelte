<svelte:options immutable={true} />

<script lang="ts">
import * as Resizable from "$lib/components/ui/resizable"
import ContentCard from "$lib/components/content_card/ContentCard.svelte"
import { template_store } from "./lib/store/template"
import { tick } from "svelte"
import type { HtmlContent, PlotContent, TableContent } from "./types/template"

type Content = HtmlContent | PlotContent | TableContent
let template = $template_store
$: contents = template.contents ?? []

const onAdd = async () => {
  const new_content = { tag: "p", content: "" } as HtmlContent
  template_store.update((store) => {
    if (store.contents === undefined) {
      store.contents = [new_content]
    }
    store.contents = [...store.contents, new_content]
    return store
  })
  contents = $template_store.contents ?? []
}
const onDelete = async (i: number) => {
  template_store.update((store) => {
    if (store.contents === undefined) {
      store.contents = []
    }
    store.contents = store.contents.filter((_, j) => i !== j)
    return store
  })
  contents = $template_store.contents ?? []
}

const setContent = async (i: number, content: Content) => {
  console.log("setContent", i, content)
  template_store.update((store) => {
    if (store.contents === undefined) {
      store.contents = []
    }
    store.contents[i] = content
    return store
  })
  await tick()
  contents = $template_store.contents ?? []
}
</script>

<main class="w-screen h-screen p-0 m-0">
  <Resizable.PaneGroup direction="horizontal" class="border rounded-lg">
    <Resizable.Pane defaultSize={38} minSize={25}>
      <div class="flex flex-col h-full p-6">
        {#each contents as content, i}
          <ContentCard
            {content}
            onDelete={async () => await onDelete(i)}
            {onAdd}
            setContent={async (c) => await setContent(i, c)}
          />
        {/each}
      </div>
    </Resizable.Pane>

    <Resizable.Handle withHandle />
    <Resizable.Pane
      defaultSize={75}
      collapsible={true}
      collapsedSize={10}
      onCollapse={() => {
        console.info("Collapsed")
      }}
      onExpand={() => {
        console.info("Expanded")
      }}
    >
      <div class={`flex h-full p-6`}>
        <span class="font-semibold"> Hello world </span>
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
