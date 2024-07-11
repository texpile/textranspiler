import type { DocumentNode } from '../types/default';
import { replacePlaceholders } from '../utils';

export default async function transpileHeading(
  node: DocumentNode,
  rules: any,
  config: any,
  transpileNode: Function,
  indexArray: number[]
) {
  const headingRule = rules.heading[node.attrs!.level];
  if (!(node.content && node.content[0] !== undefined)) {
    console.warn('\x1b[33m%s\x1b[0m', 'Empty Heading ignored');
    return '';
  }
  const text = await transpileNode({ type: 'text', text: node.content![0].text }, indexArray.concat(0));
  return replacePlaceholders(headingRule, {
    text: text
  });
}
