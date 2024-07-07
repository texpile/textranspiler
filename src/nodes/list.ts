import type { DocumentNode } from "../types/default";
import { getNodeByIndex, isSameListKind, replacePlaceholders } from "../utils";

export default async function transpileList(
  node: DocumentNode,
  rules: any,
  config: any,
  transpileNode: Function,
  indexArray: number[],
  doc: DocumentNode
): Promise<string> {
  let result = "";
  const listKind = node.attrs!.kind;
  const listItems = await Promise.all(
    node.content!.map((item, idx) =>
      replacePlaceholders(rules.list_item, {
        content: transpileNode(item, indexArray.concat(idx)),
      })
    )
  );

  const previousNode = getNodeByIndex(
    doc,
    indexArray.slice(0, -1).concat(indexArray[indexArray.length - 1] - 1)
  );

  const nextNode = getNodeByIndex(
    doc,
    indexArray.slice(0, -1).concat(indexArray[indexArray.length - 1] + 1)
  );

  const isPreviousListSame = isSameListKind(previousNode, listKind);
  const isNextListSame = isSameListKind(nextNode, listKind);

  if (!isPreviousListSame) {
    result += rules.list[listKind].split("#content#")[0];
  }

  result += listItems.join("");

  if (!isNextListSame) {
    result += rules.list[listKind].split("#content#")[1];
  }

  return result;
}
