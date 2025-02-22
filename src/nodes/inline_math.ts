import type { DocumentNode } from '../types/default';
import { replacePlaceholders } from '../utils';

export default function transpileInlineMath(
  node: DocumentNode,
  rules: any,
  config: any,
  transpileNode: Function,
  indexArray: number[]
): string {
  const content = node.content?.[0]?.text as unknown as string;

  if (content === undefined) {
    throw new Error('node.content is undefined or does not contain the expected structure.');
  }
  return replacePlaceholders(rules.inline_math, {
    text: content
  });
}
