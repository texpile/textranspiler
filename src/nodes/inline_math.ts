import type { DocumentNode } from "../types/default";
import { replacePlaceholders } from "../utils";

export default function transpileInlineMath(
  node: DocumentNode,
  rules: any,
  config: any,
  transpileNode: Function,
  indexArray: number[]
): string {
  return replacePlaceholders(rules.inline_math, {
    value: node.attrs!.value,
  });
}
