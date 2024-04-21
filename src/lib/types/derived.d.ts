import type { LiteralVariable, PathVariable, HtmlContent, TableContent, PlotContent } from "./template"

type Content = HtmlContent | TableContent | PlotContent
type Variable = LiteralVariable | PathVariable

export type { Content, Variable }
