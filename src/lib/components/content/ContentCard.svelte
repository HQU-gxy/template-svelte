<svelte:options runes={true} />

<script lang="ts">
import Jar from "$lib/components/jar/Jar.svelte"
import * as Card from "$lib/components/ui/card"
import { Button } from "$lib/components/ui/button/index"
import Plus from "svelte-radix/Plus.svelte"
import { ArrowUp, ArrowDown } from "lucide-svelte"
import * as Select from "$lib/components/ui/select"
import Delete from "svelte-material-icons/Delete.svelte"
import ColumnDataEntries from "./ColumnDataEntries.svelte"
import type {
  HtmlContent,
  PlotContent,
  TableContent,
} from "$lib/types/template"
import { isNullish, type Nullish } from "utility-types"

type Content = HtmlContent | PlotContent | TableContent
/**
 * @summary a function that does not return anything, either synchronously or asynchronously
 */
type VoidFn = (() => void) | (() => Promise<void>)
type Entries = TableContent["data"] | PlotContent["data"]
type PlotType = PlotContent["plot_type"]

/**
 * @summary unify call to a void function or do nothing on a nullish value
 */
const unifyCall = (fn: VoidFn | Nullish) => {
  if (isNullish(fn)) {
    return
  }

  const r = fn()
  if (r instanceof Promise) {
    r.catch(console.error)
  }
}

interface Props {
  content: Content
  onDelete: VoidFn | Nullish
  onAdd: VoidFn | Nullish
  onUp: VoidFn | Nullish
  onDown: VoidFn | Nullish
  class?: string
}

let {
  content = $bindable(),
  onDelete = null,
  onAdd = null,
  onUp = null,
  onDown = null,
  class: className,
}: Props = $props()

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

const data = $derived("data" in content ? (content.data as Entries) : undefined)

/** tag type */
type TagType = HtmlContent["tag"]
const tagTypeList: TagType[] = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
] as const
const tagType = $derived("tag" in content ? (content.tag as string) : undefined)
const selectedTagType = $derived({
  value: tagType,
  label: tagType,
})
const setTagType = (newType: TagType) => {
  if (!isNullish(htmlContent)) {
    htmlContent.tag = newType
  }
}

/** plot type */
const plotType = $derived(
  "plot_type" in content ? (content.plot_type as PlotType) : undefined,
)
const plotTypeList: PlotType[] = ["line", "bar", "scatter"] as const
const makeFirstLetterUpperCase = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
const selectedPlotType = $derived({
  value: plotType,
  label: (() => {
    if (isNullish(plotType)) {
      return plotType
    }
    return makeFirstLetterUpperCase(plotType)
  })(),
})
const setPlotType = (newType: PlotType) => {
  if (!isNullish(plotContent)) {
    plotContent.plot_type = newType
  }
}

/** content type */
enum ContentType {
  HTML = "Text",
  PLOT = "Plot",
  TABLE = "Table",
}

const contentTypeList = [
  ContentType.HTML,
  ContentType.PLOT,
  ContentType.TABLE,
] as const

const deduceContentType = (content: Content): ContentType => {
  if ("tag" in content) {
    return ContentType.HTML
  } else if ("plot_type" in content) {
    return ContentType.PLOT
  } else if ("table_type" in content) {
    return ContentType.TABLE
  }
  return ContentType.HTML
}

const defaultHtmlContent: HtmlContent = { tag: "p", content: "" }
const defaultPlotContent: PlotContent = {
  data: {
    col_1: [1, 2, 3],
  },
  plot_type: "line",
}
const defaultTableContent: TableContent = {
  data: {
    col_1: [1, 2, 3],
  },
  table_type: "table",
}

const selected = $derived(deduceContentType(content))
// https://github.com/huntabyte/shadcn-svelte/issues/361
const selectedType = $derived({
  value: selected,
  label: selected,
})

const changeContentType = (newType: ContentType) => {
  if (selected === newType) {
    return
  }
  switch (newType) {
    case ContentType.HTML:
      content = defaultHtmlContent
      break
    case ContentType.PLOT:
      if (!isNullish(data)) {
        content = {
          data,
          plot_type: "line",
        }
      } else {
        content = defaultPlotContent
      }
      break
    case ContentType.TABLE:
      if (!isNullish(data)) {
        content = {
          data,
          table_type: "table",
        }
      } else {
        content = defaultTableContent
      }
      break
  }
}
</script>

<Card.Root class={className}>
  <Card.Header
    class="flex flex-row items-center justify-between p-2 first:pb-0"
  >
    <Select.Root selected={selectedType}>
      <Select.Trigger class="w-[120px]">
        <Select.Value placeholder="Select type" />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.Label>Types</Select.Label>
          {#each contentTypeList as t}
            <Select.Item
              value={t}
              label={t}
              onclick={() => {
                changeContentType(t)
              }}
            />
          {/each}
        </Select.Group>
      </Select.Content>
    </Select.Root>
    <div class="flex items-center space-x-2">
      {#if !isNullish(onUp)}
        <Button
          variant="outline"
          size="icon"
          on:click={() => {
            unifyCall(onUp)
          }}
        >
          <ArrowUp />
        </Button>
      {/if}
      {#if !isNullish(onDown)}
        <Button
          variant="outline"
          size="icon"
          on:click={() => {
            unifyCall(onDown)
          }}
        >
          <ArrowDown />
        </Button>
      {/if}

      {#if !isNullish(onAdd)}
        <Button
          variant="outline"
          size="icon"
          on:click={() => {
            unifyCall(onAdd)
          }}
        >
          <Plus />
        </Button>
      {/if}
      {#if !isNullish(onDelete)}
        <Button
          variant="outline"
          size="icon"
          on:click={() => {
            unifyCall(onDelete)
          }}
        >
          <Delete />
        </Button>
      {/if}
    </div>
  </Card.Header>
  <Card.CardContent class="p-2">
    {#if !isNullish(htmlContent)}
      {#if !isNullish(tagType)}
        <Select.Root selected={selectedTagType}>
          <Select.Trigger class="w-[120px]">
            <Select.Value placeholder="Select tag" />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Label>Types</Select.Label>
              {#each tagTypeList as t}
                <Select.Item
                  value={t}
                  label={t}
                  onclick={() => {
                    setTagType(t)
                  }}
                />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      {/if}

      <Jar
        content={htmlContent.content}
        onContentChange={(content) => {
          if (!isNullish(htmlContent)) {
            htmlContent.content = content
          }
        }}
        class="mt-2 code-input min-h-40"
      />
    {/if}

    {#if plotContent}
      {#if !isNullish(plotType)}
        <Select.Root selected={selectedPlotType}>
          <Select.Trigger class="w-[120px]">
            <Select.Value placeholder="Select plot type" />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Label>Plot Types</Select.Label>
              {#each plotTypeList as t}
                <Select.Item
                  value={t}
                  label={t.charAt(0).toUpperCase() + t.slice(1)}
                  onclick={() => {
                    setPlotType(t)
                  }}
                />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      {/if}
      <ColumnDataEntries bind:entries={plotContent.data} />
    {/if}

    {#if tableContent}
      <ColumnDataEntries bind:entries={tableContent.data} />
    {/if}
  </Card.CardContent>
</Card.Root>
