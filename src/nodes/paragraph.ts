import type { DocumentNode } from "../types/default";
import { replacePlaceholders } from "../utils";

export default async function transpileParagraph(
  node: DocumentNode,
  rules: any,
  config: any,
  transpileNode: Function,
  indexArray: number[]
) {
  let result = "";
  if (node.content) {
    if (node.content.length == 1 && node.content[0].type == "inline_math") {
      result = replacePlaceholders(rules.block_math, {
        text: node.content[0].attrs!.value,
      });
    } else {
      const contentResults = await Promise.all(
        node.content.map((child, idx) =>
          transpileNode(child, indexArray.concat(idx))
        )
      );
      result = contentResults.join("");
    }
  }
  return replacePlaceholders(rules.paragraph, { text: result }, true);
}
