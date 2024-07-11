import type { DocumentNode, UploadResource } from '../types/default';
import { getNodeByIndex, replacePlaceholders } from '../utils';

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
      scale: '' + (node.attrs.width ?? 0.5) / (node.attrs.maxWidth ?? 1)
    },true);
  }
  //check if the previous 2 node is all paragraph
  const previousNode = getNodeByIndex(doc, indexArray.slice(0, -1).concat(indexArray[indexArray.length - 1] - 1));
  const nodeb4prevNode = getNodeByIndex(doc, indexArray.slice(0, -1).concat(indexArray[indexArray.length - 1] - 2));
  //check if these 2 nodes are both paragraph
  if (!previousNode || !nodeb4prevNode) {
    // console.warn('One or both of the nodes do not exist.');
  } else if (previousNode.type !== 'paragraph' || nodeb4prevNode.type !== 'paragraph') {
    //not having 2 or more paragraph in LaTeX will cause wrap figure to float
    console.warn(`\x1b[33m${indexArray}: Possible LaTeX Warning: Stationary wrapfigure forced to float\x1b[0m`);
  }

  if (node.attrs?.align == 'left') {
    return replacePlaceholders(rules.image.left, {
      src: filename,
      caps: node.attrs.alt,
      scale: '' + (node.attrs.width ?? 1) / (node.attrs.maxWidth ?? 1),
      scale2: '' + ((node.attrs.width ?? 1) / (node.attrs.maxWidth ?? 1) - rules.image.margin)
    },true);
  }
  return replacePlaceholders(rules.image.right, {
    src: filename,
    caps: node.attrs.alt,
    scale: '' + (node.attrs.width ?? 1) / (node.attrs.maxWidth ?? 1),
    scale2: '' + ((node.attrs.width ?? 1) / (node.attrs.maxWidth ?? 1) - rules.image.margin)
  },true);
}
