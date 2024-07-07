import type { DocumentNode } from "../types/default";
import { replacePlaceholders } from "../utils";

export default function transpileHeading(node: DocumentNode, rules: any, config: any, transpileNode: Function, indexArray: number[]): string {
  const headingRule = rules.heading[node.attrs!.level];
  return replacePlaceholders(headingRule, {
    text: transpileNode(
      { type: "text", text: node.content![0].text },
      indexArray.concat(0)
    ),
  });
}
