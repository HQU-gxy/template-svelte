<svelte:options runes={true} />

<script lang="ts">
import type { Variable } from "$lib/types/derived"
import type { LiteralVariable, PathVariable } from "$lib/types/template"
import { isNullish, type Nullish } from "utility-types"
import DoubleClick from "$lib/components/misc/DoubleClick.svelte"
import { Input } from "../ui/input"

interface Props {
  field: Variable
  class?: string
  keyGetter?: (() => string[]) | Nullish
}

const {
  field = $bindable(),
  class: className = "",
  keyGetter = null,
}: Props = $props()
const literalField = $derived(
  "expr" in field ? (field as LiteralVariable) : undefined,
)
const pathField = $derived(
  "json_path" in field ? (field as PathVariable) : undefined,
)
const verifyName = (name: string, newName: string, setter: (n: string) => void) => {
  const tn = newName.trim()
  if (tn === name) {
    return
  }
  if (!isNullish(keyGetter)) {
    const keys = keyGetter()
    if (keys.includes(tn)) {
      return
    }
  }
  if (tn === "") {
    return
  }
  setter(tn)
}
</script>

<div class={`${className}`}>
  {#if !isNullish(literalField)}
    <div class="flex flex-row items-center justify-between space-x-4">
      <DoubleClick
        content={literalField.name}
        class="w-2/12 font-bold"
        onUpdate={
          (n: string) => {
            verifyName(literalField.name, n, (name) => {
              literalField.name = name
            })
          }}/>
      <DoubleClick class="w-10/12"
        content={literalField.expr} onUpdate={
        (e: string) => {
          if (e.trim() === "") return
          literalField.expr = e
        }} />
    </div>
  {/if}
  {#if !isNullish(pathField)}
    <div class="flex flex-row items-center justify-between space-x-4">
      <DoubleClick
        content={pathField.name}
        class="w-2/12 font-bold"
        onUpdate={
          (n: string) => {
            verifyName(pathField.name, n, (name) => {
              pathField.name = name
            })
          }}/>
      <DoubleClick class="w-5/12"
        content={pathField.json_path} onUpdate={
        // TODO: verify json path
        (p: string) => {
          if (p.trim() === "") return
          pathField.json_path = p
        }} />
      <DoubleClick class="w-5/12"
        content={pathField.source} onUpdate={
        (s: string) => {
          if (s.trim() === "") return
          pathField.source = s
        }} />
    </div>
  {/if}
</div>
