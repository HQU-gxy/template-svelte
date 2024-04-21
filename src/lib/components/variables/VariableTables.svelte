<svelte:options runes={true} />

<script lang="ts">
import type { Variable } from "$lib/types/derived"
import VariableField from "./VariableField.svelte"

interface Props {
  variables: Variable[]
  class?: string
}

const { variables = $bindable(), class: className = "" }: Props = $props()
</script>

<div class={`overflow-y-auto ${className} flex-col flex space-y-2`}>
  {#each variables as variable, i}
    <VariableField
      bind:field={variables[i]}
      keyGetter={() => variables.map((v) => v.name)}
    />
  {/each}
</div>
