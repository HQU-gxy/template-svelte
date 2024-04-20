<script lang="ts">
import * as Resizable from "$lib/components/ui/resizable"
import Jar from "$lib/components/jar/Jar.svelte"
import * as Card from "$lib/components/ui/card"
import { Button } from "$lib/components/ui/button/index"
import Plus from "svelte-radix/Plus.svelte"
import * as Select from "$lib/components/ui/select"
import Delete from "svelte-material-icons/Delete.svelte"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
] as const

type Fruit = (typeof fruits)[number]["value"]

$: is_content_collapsed = false

$: selected = undefined as { value: Fruit; label?: string } | undefined
</script>

<main class="w-screen h-screen p-0 m-0">
  <Resizable.PaneGroup direction="horizontal" class="border rounded-lg">
    <Resizable.Pane defaultSize={38} minSize={25}>
      <div class="flex flex-col h-full p-6">
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
              <Button variant="outline" size="icon">
                <Plus />
              </Button>
              <Button variant="outline" size="icon">
                <Delete />
              </Button>
            </div>
          </Card.Header>
          <Card.CardContent class="p-2">
            <Jar
              content={"lambda x:x+1"}
              class="p-2 overflow-auto rounded-md shadow-inner min-h-40 bg-slate-100"
            />
          </Card.CardContent>
        </Card.Root>
      </div>
    </Resizable.Pane>

    <Resizable.Handle withHandle />
    <Resizable.Pane
      defaultSize={75}
      collapsible={true}
      collapsedSize={10}
      onCollapse={() => {
        console.info("Collapsed")
        is_content_collapsed = true
      }}
      onExpand={() => {
        console.info("Expanded")
        is_content_collapsed = false
      }}
    >
      <div class={`flex h-full p-6 ${is_content_collapsed ? "hidden" : ""}`}>
        <span class="font-semibold"
          >{`Selected fruit: ${selected !== undefined ? selected.label : "None"}`}</span
        >
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
