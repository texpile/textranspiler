import * as fs from "fs";
import * as path from "path";

interface DocumentNode {
  type: string;
  attrs?: { [key: string]: any };
  content?: DocumentNode[];
  text?: string;
  marks?: { type: string }[];
}

interface Settings {
  package: { [key: string]: string };
  preamble: string;
  config: {
    sanitizetext: boolean;
  };
  rules: {
    [key: string]: any;
  };
}

const document: DocumentNode = require("./sample/test.json");
const settings: Settings = require("./settings/default.json");

const replacePlaceholders = (
  template: string,
  replacements: { [key: string]: string }
): string => {
  return template.replace(
    /#([^#]+)#/g,
    (_, key) => replacements[key.trim()] || ""
  );
};

const sanitizeText = (text: string): string => {
  const replacements: { [key: string]: string } = {
    "\\": "\\textbackslash{}",
    "{": "\\{",
    "}": "\\}",
    "#": "\\#",
    "%": "\\%",
    "&": "\\&",
    $: "\\$",
    _: "\\_",
    "^": "\\textasciicircum{}",
    "~": "\\textasciitilde{}",
  };
  return text.replace(/([\\{}#%&$^_~])/g, (match) => replacements[match]);
};

const transpileDocument = (
  doc: DocumentNode,
  rules: any,
  config: any
): string => {
  let latex = "";

  const transpileNode = (node: DocumentNode): string => {
    let result = "";

    switch (node.type) {
      case "doc":
        node.content?.forEach((child) => {
          result += transpileNode(child);
        });
        break;
      case "heading":
        const headingRule = rules.heading[node.attrs!.level];
        result = replacePlaceholders(headingRule, {
          text: transpileNode({ type: "text", text: node.content![0].text }),
        });
        break;
      case "paragraph":
        if (node.content) {
          result = node.content.map(transpileNode).join("");
        }
        result = replacePlaceholders(rules.paragraph, { text: result });
        break;
      case "text":
        result = node.text!;
        if (config.sanitizetext) {
          result = sanitizeText(result);
        }
        if (node.marks) {
          node.marks.forEach((mark) => {
            const textRule = rules.text[mark.type];
            if (textRule) {
              result = replacePlaceholders(textRule, { text: result });
            }
          });
        }
        break;
      case "code_block":
        result = replacePlaceholders(rules.code_block, {
          text: node.content![0].text!,
        });
        break;
      case "inline_math":
        result = replacePlaceholders(rules.inline_math, {
          value: node.attrs!.value,
        });
        break;
      case "blockquote":
        const blockquoteContent = node.content!.map(transpileNode).join("");
        result = replacePlaceholders(rules.blockquote, {
          content: blockquoteContent,
        });
        break;
      case "list":
        const listKind = node.attrs!.kind;
        const listItems = node
          .content!.map((item) =>
            replacePlaceholders(rules.list_item, {
              content: transpileNode(item),
            })
          )
          .join("\n");
        result = replacePlaceholders(rules.list[listKind], {
          content: listItems,
        });
        break;
      case "image":
        result = replacePlaceholders(rules.image, {
          src: node.attrs!.src,
          width: node.attrs!.width || "auto",
          height: node.attrs!.height || "auto",
        });
        break;
      case "table":
        const tableRows = node.content!.map(transpileNode).join("\n");
        const numColumns = node.content![0].content!.length;
        const columns = "|" + Array(numColumns).fill("X").join("|") + "|";
        result = replacePlaceholders(rules.table, {
          columns: columns,
          content: tableRows,
        });
        break;
      case "table_row":
        const tableCells = node
          .content!.map((cell) => transpileNode(cell).slice(0, -1))
          .join(" & ");
        result = replacePlaceholders(rules.table_row, { content: tableCells });
        break;
      case "table_cell":
        result = replacePlaceholders(rules.table_cell, {
          content: node.content ? transpileNode(node.content[0]) : "",
        });
        break;
      default:
        break;
    }

    return result;
  };

  latex += transpileNode(doc);
  return latex;
};

const generateLatexDocument = (
  doc: DocumentNode,
  settings: Settings
): string => {
  const packages = Object.entries(settings.package)
    .map(([pkg, options]) => `\\usepackage[${options}]{${pkg}}`)
    .join("\n");
  const preamble = settings.preamble;
  const content = transpileDocument(doc, settings.rules, settings.config);

  return `\\documentclass{article}\n${packages}\n${preamble}\n\\begin{document}\n${content}\n\\end{document}`;
};

const latexDocument = generateLatexDocument(document, settings);
fs.writeFileSync("output.tex", latexDocument);

console.log("LaTeX document generated successfully!");
