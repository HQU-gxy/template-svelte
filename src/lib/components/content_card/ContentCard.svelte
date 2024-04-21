<svelte:options immutable={false} runes={true} />

<script lang="ts">
import Jar from "$lib/components/jar/Jar.svelte"
import * as Card from "$lib/components/ui/card"
import { Button } from "$lib/components/ui/button/index"
import Plus from "svelte-radix/Plus.svelte"
import * as Select from "$lib/components/ui/select"
import Delete from "svelte-material-icons/Delete.svelte"
import ColumnDataEntries from "./ColumnDataEntries.svelte"
import type { HtmlContent, PlotContent, TableContent } from "src/types/template"
import { isNullish, type Nullish } from "utility-types"
import { get } from "svelte/store"
import { tick } from "svelte"

type Content = HtmlContent | PlotContent | TableContent
type OnDelete = () => Promise<void>
type OnAdd = () => Promise<void>

interface Props {
  content: Content
  onDelete: OnDelete | Nullish
  onAdd: OnAdd | Nullish
}

// https://www.reddit.com/r/sveltejs/comments/e9zqn1/why_use_custom_events/
const { content = $bindable(), onDelete = null, onAdd = null }: Props = $props()

const htmlContent = $derived(
  "content" in content && "tag" in content
    ? (content as HtmlContent)
    : undefined,
)

const plotContent = $derived(
  "data" in content && "plot_type" in content
    ? (content as PlotContent)
    : undefined,
)

const tableContent = $derived(
  "data" in content && "table_type" in content
    ? (content as TableContent)
    : undefined,
)

</script>

<Card.Root>
  <Card.Header class="flex flex-row items-center justify-between">
    <div class="flex justify-even items-center [&>*]:ml-2">
      {#if onAdd !== undefined}
        <Button
          variant="outline"
          size="icon"
          on:click={async () => {
            if (!isNullish(onAdd)) {
              await onAdd()
            }
          }}
        >
          <Plus />
        </Button>
      {/if}
      {#if onDelete !== undefined}
        <Button
          variant="outline"
          size="icon"
          on:click={() => {
            if (!isNullish(onDelete)) {
              onDelete().catch(console.error)
            }
          }}
        >
          <Delete />
        </Button>
      {/if}
    </div>
  </Card.Header>
  <Card.CardContent class="p-2">
    {#if !isNullish(htmlContent)}
      <Jar
        content={htmlContent.content}
        onContentChange={(content) => {
          if (!isNullish(htmlContent)) {
            htmlContent.content = content
          }
        }}
        class="p-2 overflow-auto rounded-md shadow-inner min-h-40 bg-slate-100"
      />
    {/if}

    {#if plotContent}
      <ColumnDataEntries bind:entries={plotContent.data} />
    {/if}

    {#if tableContent}
      <ColumnDataEntries bind:entries={tableContent.data} />
    {/if}
  </Card.CardContent>
</Card.Root>
