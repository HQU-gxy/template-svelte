<svelte:options runes={true} />

<script lang="ts">
import Input from "$lib/components/ui/input/input.svelte"
import { isNullish } from "utility-types"
import { tick } from "svelte"

interface Props {
  content: string
  class?: string
  onUpdate: (content: string) => void
}

const { content, class: className = "", onUpdate }: Props = $props()
let is_editing = $state(false)
let editContent = $state(content)
const finishEditing = () => {
  is_editing = false
  onUpdate(editContent)
  editContent = content
}
</script>

{#if is_editing}
  <Input
    class={className}
    on:blur={async (e) => {
      await tick()
      finishEditing()
    }}
    onkeydown={async (e) => {
      if (e.key === "Enter") {
        await tick()
        finishEditing()
      }
    }}
    oninput={(e) => {
      const target = e.target as HTMLInputElement
      const val = target?.value
      if (isNullish(val)) return
      editContent = val
    }}
    value={editContent}
  />
{:else}
  <div
    class={className}
    role="button"
    tabindex="0"
    ondblclick={async () => {
      await tick()
      is_editing = true
    }}
  >
    {content}
  </div>
{/if}
