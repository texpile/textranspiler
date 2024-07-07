import type { DocumentNode } from "../types/default";
import { replacePlaceholders } from "../utils";

export default async function transpileTableRow(
  node: DocumentNode,
  rules: any,
  config: any,
  transpileNode: Function,
  indexArray: number[]
): Promise<string> {
  const tableCells = await Promise.all(
    node.content!.map((cell, idx) =>
      transpileNode(cell, indexArray.concat(idx))
    )
  );
  return replacePlaceholders(rules.table_row, {
    content: tableCells.join(" & "),
  });
}
