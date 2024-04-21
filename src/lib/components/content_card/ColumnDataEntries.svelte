<svelte:options runes={true} />

<script lang="ts">
import Jar from "$lib/components/jar/Jar.svelte"
import { Button } from "$lib/components/ui/button/index"
import Delete from "svelte-material-icons/Delete.svelte"
import { Input } from "$lib/components/ui/input"
import { Label } from "$lib/components/ui/label"
import type { HtmlContent, PlotContent, TableContent } from "src/types/template"
import NumberArrayInput from "./NumberArrayInput.svelte"

type TableEntries = TableContent["data"]
type PlotEntries = PlotContent["data"]
type AssertEqual<T, Expected> = T extends Expected
  ? Expected extends T
    ? true
    : never
  : never
const _: AssertEqual<TableEntries, PlotEntries> = true
type Entries = TableEntries

interface Props {
  entries: Entries
}

const { entries = $bindable() }: Props = $props()
</script>

{#each Object.entries(entries) as [k, v]}
  <div>
    {#if v instanceof Array}
      <NumberArrayInput
        title={k}
        entries={v}
        onValidChange={(array) => {
          entries[k] = array
        }}
      />
    {:else if typeof v === "string"}
      <div>
        <Label>{k}</Label>
        <Jar
          content={v}
          onContentChange={(content) => {
            entries[k] = content
          }}
          class="code-input"
        />
      </div>
    {/if}
  </div>
{/each}
