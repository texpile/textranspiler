import type { DocumentNode } from '../types/default';
import { replacePlaceholders, sanitizeText } from '../utils';

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

  if (config.splitconnectedlines.character > 0) {
    const splittext = result.split(' ');
    result = '';
    for (let i = 0; i < splittext.length; i++) {
      let element = splittext[i];
      if (element.length >= config.splitconnectedlines.character) {
        result += replacePlaceholders(config.splitconnectedlines.command, { text: element }) + ' ';
      } else {
        result += element + (i < splittext.length - 1 ? ' ' : '');
      }
    }
  }

  if (node.marks) {
    node.marks.forEach(mark => {
      const textRule = rules.marks[mark.type];
      if (textRule) {
        result = replacePlaceholders(textRule, { text: result });
      }
    });
  }
  return result;
}

