import type { Template } from "src/types/template"
import { writable } from "@crikey/stores-immer"

const default_template: Template = {
  imports: ["import numpy as np", "from datetime import datetime", "import builtins"],
  data_sources: [
    {
      source_type: "dict",
      name: "test",
      data: { a: 1, b: 2, c: 3 },
      json_schema: {
        type: "object",
        properties: {
          a: { type: "integer" },
          b: { type: "integer" },
          c: { type: "integer" },
        },
      },
    }
  ],
  variables: [
    {
      name: "s",
      expr: "datetime.now()",
      formatter: "lambda x: x.strftime('%Y 年 %m 月 %d 日 %H:%M:%S')",
      t: "datetime",
    },
    {
      name: "a",
      source: "test",
      json_path: "$.a",
      t: "int",
    },
    {
      name: "b",
      source: "test",
      json_path: "$.b",
      preprocessor: "lambda x: builtins.str(x) + '1'",
      t: "str",
    },
    {
      name: "c",
      source: "test",
      json_path: "$.c",
    },
    {
      name: "d",
      expr: "a + builtins.int(b) + c",
      t: "int",
    }
  ],
  contents: [
    { tag: "p", content: "时间是 ${s}; a 是 ${a}, b 是 ${b}, c 是 ${c} d 是 ${d}" },
    {
      table_type: "table",
      data: {
        col_1: "${[a, b, c]}",
        col_2: [1, 2, 3],
      },
    },
  ],
} as const

const template_store = writable<Template>(default_template)

export { template_store, default_template }
