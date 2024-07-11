import type { DocumentNode } from "../types/default";
import { getNodeByIndex, replacePlaceholders } from "../utils";

export default async function transpileTableCell(
  node: DocumentNode,
  rules: any,
  config: any,
  transpileNode: Function,
  indexArray: number[],
  doc: DocumentNode
): Promise<string> {
  const content = node.content
    ? await transpileNode(node.content[0], indexArray.concat(0))
    : "";
  
  //check if its last item in the row, if it is do not add extra &
  const nextNode = getNodeByIndex(doc, indexArray.slice(0, -1).concat(indexArray[indexArray.length - 1] + 1));
  if(!nextNode){
    return content;
  }
  return replacePlaceholders(rules.table_cell, {
    content: content,
  });
}
