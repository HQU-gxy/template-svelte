<svelte:options runes={true} />

<script lang="ts">
import { Button } from "$lib/components/ui/button/index"
import Delete from "svelte-material-icons/Delete.svelte"
import { Input } from "$lib/components/ui/input"
import { Label } from "$lib/components/ui/label"
import { isNullish } from "utility-types"

type NumberArray = number[]

interface Props {
  title: string
  entries: NumberArray
  onValidChange: (array: NumberArray) => void
}

let error: string | null = $state(null)
let { entries = $bindable(), title, onValidChange }: Props = $props()
</script>

<div>
  <Label>
    {title}
    {#if error}
      <span class="text-red-500">{error}</span>
    {/if}
  </Label>
  <Input type="text" value={
    JSON.stringify(entries)
  }
  oninput={(e) => {
    if (!(e.target instanceof HTMLInputElement)) {
      return
    }
    try {
      const temp: any = JSON.parse(e.target.value as string)
      if (temp instanceof Array) {
        temp.map((x, i) => [i, x, typeof x] as const).forEach(([i, x, t]) => {
          if (t !== "number") {
            throw new Error(`Expected number at index ${i} but got ${x} (${t})`)
          }
        })
        entries = temp
        error = null
        onValidChange(temp as NumberArray)
      }
    } catch (e) {
      // @ts-expect-error
      error = e.message
    }
  }} class="code-input"
  />
</div>
