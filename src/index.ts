import * as fs from "fs";
import type { DocumentNode, Settings } from "./types/default";
import {
  getNodeByIndex,
  isSameListKind,
  replacePlaceholders,
  sanitizeText,
} from "./utils";
import document from "./sample/test.json";
import settings from "./settings/default.json";

async function transpileDocument(
  doc: DocumentNode,
  rules: any,
  config: any
): Promise<string> {
  let latex = "";
  let callcount = 0;
  console.time("transpileDocument");

  async function transpileNode(
    node: DocumentNode,
    indexArray: number[]
  ): Promise<string> {
    callcount++;
    let result = "";

    const nodeType = node.type;

    try {
      const transpileNodeType = (await import(`./nodes/${nodeType}.ts`))
        .default;
      result = await transpileNodeType(
        node,
        rules,
        config,
        transpileNode,
        indexArray,
        doc
      );
    } catch (error) {
      console.error(`Error loading module for node type ${nodeType}`, error);
    }

    return result;
  }

  const node = await transpileNode(doc, []);
  console.log(node);
  latex += node;
  console.log("Total call: " + callcount)
  console.timeEnd("transpileDocument");
  return latex;
}

async function generateLatexDocument(
  doc: DocumentNode,
  settings: Settings
): Promise<string> {
  const packages = Object.entries(settings.package)
    .map(([pkg, options]) => `\\usepackage[${options}]{${pkg}}`)
    .join("\n");
  const preamble = settings.preamble;
  const content = await transpileDocument(doc, settings.rules, settings.config); // Await the transpileDocument function

  return `\\documentclass{article}\n${packages}\n${preamble}\n\\begin{document}\n${content}\n\\end{document}`;
}

async function main() {
  const latexDocument = await generateLatexDocument(document, settings);
  fs.writeFileSync("output.tex", latexDocument);
  console.log("LaTeX document generated successfully!");

}

main().catch(console.error);
