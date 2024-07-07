import type { DocumentNode } from "../types/default";

export default async function transpileDoc(
    node: DocumentNode,
    rules: any,
    config: any,
    transpileNode: Function,
    indexArray: number[]
  ): Promise<string> {
    let result = "";
    if (node.content) {
      const contentResults = await Promise.all(
        node.content.map((child, idx) => transpileNode(child, indexArray.concat(idx)))
      );
      result = contentResults.join("");
    }
    return result;
  }
  