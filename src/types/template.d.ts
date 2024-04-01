/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Template for generating a report.
 *
 * This schema can be viewed with [atlassian-labs/json-schema-viewer](https://json-schema.app/) or [Redocly/redoc](https://github.com/Redocly/redoc).
 */
export interface Template {
  /**
   * List of python import statements. Could be .
   *
   * - `import <module>`
   * - `from <module> import <name>`
   *
   * It's recommended to import the [builtins](https://docs.python.org/3/library/builtins.html) since
   * they are not imported by default.
   *
   * `from <module> import *` is not allowed.
   */
  imports?: string[];
  /**
   * Data sources that can be used by `PathVariable` in the variables section
   */
  data_sources?: (DictSource | FileSource | APISource)[];
  /**
   * Variables that can be used/evaluated in the `contents` section
   */
  variables: (PathVariable | LiteralVariable)[];
  /**
   * content of the template by the order they should be rendered.
   */
  contents?: (HtmlContent | TableContent | PlotContent)[];
  [k: string]: unknown;
}
/**
 * A data source directly represented as a dictionary/JSON object
 */
export interface DictSource {
  /**
   * name of the data source
   */
  name: string;
  /**
   * comment about the data source. only used for documentation purposes
   */
  comment?: string;
  json_schema?:
    | {
        [k: string]: unknown;
      }
    | string
    | null;
  /**
   * must be `dict`
   */
  source_type: "dict";
  data: Data;
  [k: string]: unknown;
}
/**
 * the data source whose type must be `Dict[str, Any]` (i.e. a JSON object)
 */
export interface Data {
  [k: string]: unknown;
}
/**
 * A data source fetch data from a file
 */
export interface FileSource {
  /**
   * name of the data source
   */
  name: string;
  /**
   * comment about the data source. only used for documentation purposes
   */
  comment?: string;
  json_schema?:
    | {
        [k: string]: unknown;
      }
    | string
    | null;
  /**
   * must be `file`
   */
  source_type: "file";
  /**
   * path to the file
   */
  path: string;
  [k: string]: unknown;
}
/**
 * A data source fetch data from an API endpoint
 */
export interface APISource {
  /**
   * name of the data source
   */
  name: string;
  /**
   * comment about the data source. only used for documentation purposes
   */
  comment?: string;
  json_schema?:
    | {
        [k: string]: unknown;
      }
    | string
    | null;
  /**
   * must be `api`
   */
  source_type: "api";
  /**
   * URL of the API endpoint
   */
  url: string;
  [k: string]: unknown;
}
/**
 * A variable extracted from a data source using a JSON path
 */
export interface PathVariable {
  /**
   * name of the variable
   */
  name: string;
  /**
   * JSON path to extract the variable from the data source whose output is a
   * JSON object.
   * See also [JSONPath](https://www.ietf.org/archive/id/draft-goessner-dispatch-jsonpath-00.html)
   */
  json_path: string;
  /**
   * comment about the variable. only used for documentation purposes
   */
  comment?: string;
  /**
   * a python lambda function that formats the variable. e.g. `lambda x: x.upper()`
   */
  formatter?: string;
  /**
   * a python type. e.g. `str`, `int`, `float`, `bool` `list`, `dict`.
   * Will be checked if provided.
   */
  t?: string;
  /**
   * the name of the data source. must match the name of a data source in the `data_sources` list
   */
  source: string;
  /**
   * a python lambda function that verifies the variable. e.g. `lambda
   * x: x > 0`. if provided the variable will be checked against this
   * function.
   */
  verifier?: string;
  /**
   * a python lambda function that preprocesses the variable. e.g.
   * `lambda x: x.strip()`. Type check and verification will be done after
   * preprocessing.
   */
  preprocessor?: string;
  [k: string]: unknown;
}
/**
 * A variable with an expression that evaluates to a value
 */
export interface LiteralVariable {
  /**
   * name of the variable
   */
  name: string;
  /**
   * JSON path to extract the variable from the data source whose output is a
   * JSON object.
   * See also [JSONPath](https://www.ietf.org/archive/id/draft-goessner-dispatch-jsonpath-00.html)
   */
  json_path?: string;
  /**
   * comment about the variable. only used for documentation purposes
   */
  comment?: string;
  /**
   * a python lambda function that formats the variable. e.g. `lambda x: x.upper()`
   */
  formatter?: string;
  /**
   * a python type. e.g. `str`, `int`, `float`, `bool` `list`, `dict`.
   * Will be checked if provided.
   */
  t?: string;
  /**
   * any valid python expression
   *
   * `expr` can only refer to variables defined in the `variables` section,
   * or the variables/modules imported in the `imports` section.
   */
  expr: string;
  [k: string]: unknown;
}
/**
 * HtmlContent will render a html tag with content and style
 */
export interface HtmlContent {
  /**
   * The tag to be rendered. Each tag will have a different style.
   */
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "em" | "strong" | "blockquote" | "b" | "i" | "u";
  /**
   * content field will be rendered as the content of this block.
   * The text in the content field will be rendered as is, except
   * for `${<expr>}` wrapped regions. The content in the `${<expr>}` will be
   * evaluated as a python expression. The expression can only
   * refer to variables defined in the `variables` section,
   * and the variables/modules imported in the `imports` section.
   *
   * For example, if the content is `Hello ${name}`, and there's
   * a variable called `name` in the variables section whose value
   * is `world`, the rendered content will be `Hello world`.
   */
  content: string;
  style?: Style;
  [k: string]: unknown;
}
/**
 * The CSS style applied to this block. See also [CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)
 */
export interface Style {
  [k: string]: string;
}
/**
 * TableContent will render a table by columns
 */
export interface TableContent {
  /**
   * The data to be rendered. The keys are the column names and the
   * values are the data in the column.
   * The value can be either a string or a list of numbers.
   *
   * If it's a list of numbers, the data will be used as the value of column
   * directly. If it's a string, it's expected to be `${expr}`, whihc `expr`
   * is a python expression (see `LiteralVariable` for more details).
   * Please note that the variable must be defined in the `variables` section,
   * and the result of evaluation must be a list of numbers. Further, only one expression
   * is allowed in the string. `${expr1} ${expr2}` is illegal.
   */
  data: {
    [k: string]: number[] | string;
  };
  /**
   * must be `table`
   */
  table_type: "table";
  [k: string]: unknown;
}
/**
 * PlotContent will render a plot with the data provided
 */
export interface PlotContent {
  /**
   * The data to be rendered. The keys are the column names and the
   * values are the data in the column.
   * The value can be either a string or a list of numbers.
   *
   * If it's a list of numbers, the data will be used as the value of column
   * directly. If it's a string, it's expected to be `${expr}`, whihc `expr`
   * is a python expression (see `LiteralVariable` for more details).
   * Please note that the variable must be defined in the `variables` section,
   * and the result of evaluation must be a list of numbers. Further, only one expression
   * is allowed in the string. `${expr1} ${expr2}` is illegal.
   */
  data: {
    [k: string]: number[] | string;
  };
  /**
   * The type of the plot
   */
  plot_type: "line" | "bar" | "pie" | "scatter" | "histogram";
  [k: string]: unknown;
}
