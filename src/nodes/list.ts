import type { DocumentNode } from '../types/default';
import { getNodeByIndex, isSameListKind, replacePlaceholders } from '../utils';

export default async function transpileList(
  node: DocumentNode,
  rules: any,
  config: any,
  transpileNode: Function,
  indexArray: number[],
  doc: DocumentNode
): Promise<string> {
  let result = '';
  const listKind = node.attrs!.kind;
  const listItems = await Promise.all(
    node.content!.map(async (item, idx) => {
      console.log(item.content);
      /*
      Due to the recursive nature of the transpiler, lets assume we have a list node with the child of 2 list node
            List
      child 1  child 2

      when transpiling child 2, the transpileList function will append \item into child 2 so the code looks like
      [ \begin
      \item child 1,
      \item child 2
      \end ]
      When processing the main List, these 2 content will be joint again with another \item, causing a duplicated \item
      
      The following code is the fix which allows the main List NOT append an extra \item if its child is a linked list.
      Ideally, a single list should be treated as an hole entity but due to the nature of the json document representation,
      an entire list is represented by mutiple child with each child containing a single list content.
      */
      if (idx > 0 && isSameListKind(getNodeByIndex(doc, indexArray.concat(idx - 1)) || null, listKind)) {
        return transpileNode(item, indexArray.concat(idx));
      }

      //ensures the default expected behavior of the word processor
      if (item.type == 'list') {
        return replacePlaceholders(rules.nolabel_list_item, {
          content: await transpileNode(item, indexArray.concat(idx))
        });
      }
      return replacePlaceholders(rules.list_item, {
        content: await transpileNode(item, indexArray.concat(idx))
      });
    })
  );

  const previousNode = getNodeByIndex(doc, indexArray.slice(0, -1).concat(indexArray[indexArray.length - 1] - 1));

  const nextNode = getNodeByIndex(doc, indexArray.slice(0, -1).concat(indexArray[indexArray.length - 1] + 1));

  const isPreviousListSame = isSameListKind(previousNode, listKind);
  const isNextListSame = isSameListKind(nextNode, listKind);

  if (!isPreviousListSame) {
    result += '\n' + rules.list[listKind].split('#content#')[0];
  }

  result += listItems.join('');

  if (!isNextListSame) {
    result += rules.list[listKind].split('#content#')[1] + '\n';
  }
  return result;
}
