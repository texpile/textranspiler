import type { DocumentNode, Settings, UploadResource } from './types/default';
import { replacePlaceholders } from './utils';
// import document from './sample/test.json';
// import settings from './settings/default.json';
// import fs from "fs"

const nodesContext = (require as any).context('./nodes', false, /\.ts$/);

async function transpileDocument(doc: DocumentNode, rules: any, config: any): Promise<string[]> {
  let latex = '';
  let callcount = 0;
  console.time('transpileDocument');
  const sentfiles: UploadResource[] = [];

  async function transpileNode(node: DocumentNode, indexArray: number[]): Promise<string> {
    callcount++;
    let result = '';

    const nodeType = node.type;
    const modulePath = `./${nodeType}.ts`;

    try {
      if (nodesContext.keys().includes(modulePath)) {
        const transpileNodeType = (await nodesContext(modulePath)).default;
        result = await transpileNodeType(node, rules, config, transpileNode, indexArray, doc, sentfiles);
      } else {
        throw new Error(`Module ${modulePath} not found`);
      }
    } catch (error) {
      console.error(`Error loading module for node type ${nodeType}`, error);
    }
    return result;
  }

  const node = await transpileNode(doc, []);
  latex += node;
  console.log('Total call: ' + callcount);
  console.timeEnd('transpileDocument');
  return [latex, JSON.stringify(sentfiles)];
}

export async function generateLatexDocument(
  doc: DocumentNode, 
  settings: Settings, 
  config: {documentclass?:string,  title?: string, author?: string, date?: string } = {}
): Promise<string[]> {
  
  const packages = Object.entries(settings.package)
    .map(([pkg, options]) => `\\usepackage[${options}]{${pkg}}`)
    .join('\n');
  
  const replacements = {
    title: config.title || "Untitled",
    author: config.author || "Anonymous",
    date: config.date || "\\today"
  };
  
  const preamble = replacePlaceholders(settings.preamble, replacements);
  
  const content = await transpileDocument(doc, settings.rules, settings.config);

  return [
    `\\documentclass{${config.documentclass || "article"}}\n${packages}\n${preamble}\n\\begin{document}\n${content[0]}\n\\printbibliography\n\\end{document}`, 
    content[1]
  ];
}


