import type { DocumentNode } from "../types/default";
import { replacePlaceholders } from "../utils";

export default async function transpileBlockquote(
  node: DocumentNode,
  rules: any,
  config: any,
  transpileNode: Function,
  indexArray: number[]
): Promise<string> {
  const blockquoteContent = await Promise.all(
    node.content!.map((child, idx) =>
      transpileNode(child, indexArray.concat(idx))
    )
  );
  return replacePlaceholders(rules.blockquote, {
    content: blockquoteContent.join(""),
  });
}
