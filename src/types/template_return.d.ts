/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The evaluation result of a template.
 */
export interface TemplateReturn {
  /**
   * The evaluated variables
   */
  variables: {
    /**
     * name of the variable
     */
    name: string;
    /**
     * the value of the variable
     */
    value: {
      [k: string]: unknown;
    };
    [k: string]: unknown;
  }[];
  /**
   * The rendered contents
   */
  contents: (HtmlContent | TableContent | PlotContent)[];
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
   * the rendered content
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
   * the evaluated data
   */
  data: number[];
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
   * the evaluated data
   */
  data: number[];
  /**
   * The type of the plot
   */
  plot_type: "line" | "bar" | "pie" | "scatter" | "histogram";
  [k: string]: unknown;
}