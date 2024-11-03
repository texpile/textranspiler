import type { DocumentNode, DocumentSettings, UploadResource } from './types/default';
import { replacePlaceholders } from './utils';
// import document from './sample/test.json';
// import settings from './settings/default.json';
// import fs from "fs"

const nodesContext = (require as any).context('./nodes', false, /\.ts$/);

async function transpileDocument(doc: DocumentNode, rules: DocumentSettings['rules'], config: DocumentSettings['config']): Promise<string[]> {
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
  settings: DocumentSettings, 
  config: {documentclass?: string, documentoptions?: string, title?: string, author?: string, teacher?:string, subject?:string, date?: string } = {}
): Promise<string[]> {
  
  const packages = Object.entries(settings.package)
    .map(([pkg, options]) => `\\usepackage${options ? `[${options}]` : ''}{${pkg}}`)
    .join('\n');
  
  const replacements = {
    title: config.title || "Untitled",
    author: config.author || "Anonymous",
    teacher: config.teacher || "Unknown",
    subject: config.subject || "Unknown",
    date: config.date || "\\today",
  };
  const preamble = replacePlaceholders(settings.preamble, replacements);
  const content = await transpileDocument(doc, settings.rules, settings.config);
  const documentClass = config.documentclass || settings.documentclass || "article";
  const documentOptions = config.documentoptions || "12pt";
  const documentTemplate = replacePlaceholders(settings.document, {
    content: content[0],
    ...replacements
  });

  return [
    `\\documentclass[${documentOptions}]{${documentClass}}\n${packages}\n${preamble}\n${documentTemplate}`, 
    content[1]
  ];
}


