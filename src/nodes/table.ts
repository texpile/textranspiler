import type { DocumentNode } from "../types/default";
import { replacePlaceholders } from "../utils";

export default async function transpileTable(
  node: DocumentNode,
  rules: any,
  config: any,
  transpileNode: Function,
  indexArray: number[]
): Promise<string> {
  const tableRows = await Promise.all(
    node.content!.map((child, idx) => transpileNode(child, indexArray.concat(idx)))
  );
  const numColumns = node.content![0].content!.length;
  const columns = "|" + Array(numColumns).fill("X").join("|") + "|";
  return replacePlaceholders(rules.table, {
    columns: columns,
    content: tableRows.join(""),
  }, true);
}
