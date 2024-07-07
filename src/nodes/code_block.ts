import type { DocumentNode } from '../types/default';
import { replacePlaceholders } from '../utils';

export default function transpileCodeBlock(
  node: DocumentNode,
  rules: any,
  config: any,
  transpileNode: Function,
  indexArray: number[]
): string {
  return replacePlaceholders(
    rules.code_block,
    {
      text: node.content![0].text!,
    },
    true
  );
}
