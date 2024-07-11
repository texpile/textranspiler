import { DocumentNode } from '../types/default';

export default async function transpilehard_break(
  node: DocumentNode,
  rules: any,
  config: any,
  transpileNode: Function,
  indexArray: number[]
): Promise<string> {
  console.log('\x1b[31m%s\x1b[0m', 'hard break');
  return '\\newline';
}
