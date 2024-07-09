import type { DocumentNode } from "../types/default";
import { replacePlaceholders, sanitizeText } from "../utils";

export default function transpileText(
  node: DocumentNode,
  rules: any,
  config: any,
  transpileNode: Function,
  indexArray: number[]
): string {
  let result = node.text!;
  if (config.sanitizetext) {
    result = sanitizeText(result);
  }
  if (node.marks) {
    node.marks.forEach((mark) => {
      const textRule = rules.marks[mark.type];
      if (textRule) {
        result = replacePlaceholders(textRule, { text: result });
      }
    });
  }
  return result;
}
