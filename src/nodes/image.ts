import type { DocumentNode, UploadResource } from '../types/default';
import { replacePlaceholders } from '../utils';

export default function transpileImage(
  node: DocumentNode,
  rules: any,
  config: any,
  transpileNode: Function,
  indexArray: number[],
  doc: any,
  sentfiles: UploadResource[]
) {
  if (!node.attrs?.src || node.attrs.src.split('/').length < 3) {
    throw new Error('Image: Invalid or missing src attribute id:' + indexArray);
  }

  const filename = node.attrs.src.split('/').pop();
  const urlshort = node.attrs.src.split('/').slice(2).join('/');

  sentfiles.push({ type: 'image', file: filename, url: urlshort });
  if (node.attrs?.align == 'center') {
    return replacePlaceholders(rules.image.center, {
      src: filename,
      caps: node.attrs.alt,
      scale: '' + (node.attrs.width ?? 1) / (node.attrs.maxWidth ?? 1)
    });
  } 
}
