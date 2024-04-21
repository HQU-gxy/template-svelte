<svelte:options immutable={false} />

<script lang="ts">
import Jar from "$lib/components/jar/Jar.svelte"
import * as Card from "$lib/components/ui/card"
import { Button } from "$lib/components/ui/button/index"
import Plus from "svelte-radix/Plus.svelte"
import * as Select from "$lib/components/ui/select"
import Delete from "svelte-material-icons/Delete.svelte"
import ColumnDataEntries from "./ColumnDataEntries.svelte"
import { get } from "svelte/store"
import type { HtmlContent, PlotContent, TableContent } from "src/types/template"
import { template_store } from "$lib/store/template"
import { isNullish } from "utility-types"
import { tick } from "svelte"

type Content = HtmlContent | PlotContent | TableContent
type ColumnContent = PlotContent | TableContent

// https://www.reddit.com/r/sveltejs/comments/e9zqn1/why_use_custom_events/
export let content: Content
export let onDelete: (() => Promise<void>) | null = null
export let onAdd: (() => Promise<void>) | null = null
export let onUpdate: (content: Content) => Promise<void>

const htmlContent: HtmlContent | undefined =
  "content" in content && "tag" in content
    ? (content as HtmlContent)
    : undefined
const plotContent: PlotContent | undefined =
  "data" in content && "plot_type" in content
    ? (content as PlotContent)
    : undefined
const tableContent: TableContent | undefined =
  "data" in content && "table_type" in content
    ? (content as TableContent)
    : undefined
// https://hygraph.com/blog/data-binding-in-svelte

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
] as const

type Fruit = (typeof fruits)[number]["value"]

$: selected = undefined as { value: Fruit; label?: string } | undefined

$: {
  if (!isNullish(onUpdate)) {
    ;(async () => {
      // await tick()
      await onUpdate(content)
    })().catch(console.error)
  }
}
</script>

<Card.Root>
  <Card.Header class="flex flex-row items-center justify-between">
    <Select.Root
      {selected}
      onSelectedChange={(s) => {
        if (s !== undefined) {
          selected = s
        }
      }}
    >
      <Select.Trigger class="w-[180px]">
        <Select.Value placeholder="Select a fruit" />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.Label>Fruits</Select.Label>
          {#each fruits as fruit}
            <Select.Item value={fruit.value} label={fruit.label}
              >{fruit.label}</Select.Item
            >
          {/each}
        </Select.Group>
      </Select.Content>
    </Select.Root>

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
    {#if htmlContent}
      <Jar
        content={htmlContent.content}
        onContentChange={(content) => {
          htmlContent.content = content
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
