<svelte:options immutable={false} />

<script lang="ts">
import Jar from "$lib/components/jar/Jar.svelte"
import * as Card from "$lib/components/ui/card"
import { Button } from "$lib/components/ui/button/index"
import Plus from "svelte-radix/Plus.svelte"
import * as Select from "$lib/components/ui/select"
import Delete from "svelte-material-icons/Delete.svelte"
import { tick } from "svelte"
import { get } from "svelte/store"
import type { HtmlContent, PlotContent, TableContent } from "src/types/template"
import { template_store } from "$lib/store/template"

type Content = HtmlContent | PlotContent | TableContent
type ColumnContent = PlotContent | TableContent

export let content: Content
export let setContent: (content: Content) => Promise<void>
// https://www.reddit.com/r/sveltejs/comments/e9zqn1/why_use_custom_events/
export let onDelete: (() => Promise<void>) | undefined = undefined
export let onAdd: (() => Promise<void>) | undefined = undefined

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
          on:click={() => (onAdd !== undefined ? onAdd() : undefined)}
        >
          <Plus />
        </Button>
      {/if}
      {#if onDelete !== undefined}
        <Button
          variant="outline"
          size="icon"
          on:click={() => (onDelete !== undefined ? onDelete() : undefined)}
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
          setContent({ ...htmlContent, content })
        }}
        class="p-2 overflow-auto rounded-md shadow-inner min-h-40 bg-slate-100"
      />
    {/if}

    {#if plotContent}
      {#each Object.entries(plotContent.data) as [k, v]}
        <Jar
          content={k}
          class="p-2 overflow-auto rounded-md shadow-inner min-h-40 bg-slate-100"
        />
      {/each}
    {/if}

    {#if tableContent}
      {#each Object.entries(tableContent.data) as [k, v]}
        <div>
          {#if v instanceof Array}
            <div>
              <span class="p-2">
                {k}
              </span>
              {#each v as number, i}
                <div class="flex justify-between pl-4 mt-2">
                  <input
                    class="flex-grow mr-4"
                    value={number}
                    on:input={// https://stackoverflow.com/questions/62278480/add-onchange-handler-to-input-in-svelte
                    (e) => {
                      const target = e.target
                      if (target instanceof HTMLInputElement) {
                        const val = target.value
                        const parsed = parseFloat(val)
                        setContent({
                          ...tableContent,
                          data: {
                            ...tableContent.data,
                            // @ts-expect-error it will be an array
                            [k]: tableContent.data[k].map((_, j) =>
                              j === i ? (isNaN(parsed) ? val : parsed) : _,
                            ),
                          },
                        })
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    on:click={() => {
                      setContent({
                        ...tableContent,
                        data: {
                          ...tableContent.data,
                          // @ts-expect-error it will be an array
                          [k]: tableContent.data[k].filter((_, j) => j !== i),
                        },
                      })
                    }}
                  >
                    <Delete />
                  </Button>
                </div>
              {/each}
            </div>
          {:else if typeof v === "string"}
            <div class="flex justify-between">
              <span class="p-2">
                {k}
              </span>
              <Jar
                content={v}
                onContentChange={(content) => {
                  setContent({
                    ...tableContent,
                    data: { ...tableContent.data, [k]: content },
                  })
                }}
                class="flex-grow p-2 overflow-auto rounded-md shadow-inner bg-slate-100"
              />
            </div>
          {/if}
        </div>
      {/each}
    {/if}
    <button
      on:click={() => {
        console.log(get(template_store).contents)
      }}>display status</button
    >
  </Card.CardContent>
</Card.Root>
