import type { DocumentNode } from "../types/default";
import { replacePlaceholders } from "../utils";

export default async function transpileTableCell(
  node: DocumentNode,
  rules: any,
  config: any,
  transpileNode: Function,
  indexArray: number[]
): Promise<string> {
  const content = node.content
    ? await transpileNode(node.content[0], indexArray.concat(0))
    : "";
  return replacePlaceholders(rules.table_cell, {
    content: content,
  });
}
