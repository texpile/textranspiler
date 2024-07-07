import type { DocumentNode } from "../types/default";
import { replacePlaceholders } from "../utils";

export default function transpileImage(
  node: DocumentNode,
  rules: any,
  config: any,
  transpileNode: Function,
  indexArray: number[]
): string {
  return replacePlaceholders(rules.image, {
    src: node.attrs!.src,
    width: node.attrs!.width || "auto",
    height: node.attrs!.height || "auto",
  });
}
