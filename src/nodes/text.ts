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
  if (config.autoreplaceurl) {
    if (isUrl(result)) {
      result = replacePlaceholders(config.marks.a, { text: result });
    }
  } else if (config.sanitizetext) {
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
//chatgpt generate stuff idk how this work
function isUrl(text: string): boolean {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );
  return !!urlPattern.test(text);
}
