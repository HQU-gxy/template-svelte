<script lang="ts">
import Jar from "$lib/components/jar/Jar.svelte"
import { Button } from "$lib/components/ui/button/index"
import Delete from "svelte-material-icons/Delete.svelte"
import type { HtmlContent, PlotContent, TableContent } from "src/types/template"

type TableEntries = TableContent["data"]
type PlotEntries = PlotContent["data"]
type AssertEqual<T, Expected> = T extends Expected
  ? Expected extends T
    ? true
    : never
  : never
const _: AssertEqual<TableEntries, PlotEntries> = true
type Entries = TableEntries

export let entries: Entries
</script>

{#each Object.entries(entries) as [k, v]}
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
                  // @ts-expect-error
                  entries[k][i] = isNaN(parsed) ? val : parsed
                }
              }}
            />
            <Button
              variant="outline"
              size="icon"
              on:click={() => {
                // @ts-expect-error
                entries[k] = entries[k].filter(
                  // @ts-expect-error
                  (_, j) => i !== j,
                )
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
            entries[k] = content
          }}
          class="flex-grow p-2 overflow-auto rounded-md shadow-inner bg-slate-100"
        />
      </div>
    {/if}
  </div>
{/each}
