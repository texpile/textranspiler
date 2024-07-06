import * as fs from "fs";

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

function replacePlaceholders(
  template: string,
  replacements: { [key: string]: string },
  newline = false
): string {
  if (newline) {
    return (
      "\n" +
      template.replace(
        /#([^#]+)#/g,
        (_, key) => replacements[key.trim()] || ""
      ) +
      "\n"
    );
  }
  return template.replace(
    /#([^#]+)#/g,
    (_, key) => replacements[key.trim()] || ""
  );
}

function sanitizeText(text: string): string {
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
}

function getNodeByIndex(
  doc: DocumentNode,
  indexArray: number[]
): DocumentNode | null {
  let node: DocumentNode | null = doc;
  for (const index of indexArray) {
    if (!node || !node.content || node.content.length <= index) {
      return null;
    }
    node = node.content[index];
  }
  return node;
}

function isSameListKind(node: DocumentNode | null, kind: string) {
  return node && node.type === "list" && node.attrs!.kind === kind;
}

function transpileDocument(doc: DocumentNode, rules: any, config: any): string {
  let latex = "";

  function transpileNode(node: DocumentNode, indexArray: number[]): string {
    let result = "";

    switch (node.type) {
      case "doc":
        node.content?.forEach((child, idx) => {
          result += transpileNode(child, [idx]);
        });
        break;
      case "heading":
        const headingRule = rules.heading[node.attrs!.level];
        result = replacePlaceholders(headingRule, {
          text: transpileNode(
            { type: "text", text: node.content![0].text },
            indexArray.concat(0)
          ),
        });
        break;
      case "paragraph":
        if (node.content) {
          if (
            node.content.length == 1 &&
            node.content[0].type == "inline_math"
          ) {
            result = replacePlaceholders(rules.block_math, {
              text: node.content[0].attrs!.value,
            });
            break;
          }
          result = node.content
            .map((child, idx) => transpileNode(child, indexArray.concat(idx)))
            .join("");
        }
        result = replacePlaceholders(rules.paragraph, { text: result }, true);
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
        result = replacePlaceholders(
          rules.code_block,
          {
            text: node.content![0].text!,
          },
          true
        );
        break;
      case "inline_math":
        result = replacePlaceholders(rules.inline_math, {
          value: node.attrs!.value,
        });
        break;
      case "blockquote":
        const blockquoteContent = node
          .content!.map((child, idx) =>
            transpileNode(child, indexArray.concat(idx))
          )
          .join("");
        result = replacePlaceholders(rules.blockquote, {
          content: blockquoteContent,
        });
        break;
      case "list":
        const listKind = node.attrs!.kind;
        const listItems = node
          .content!.map((item, idx) =>
            replacePlaceholders(rules.list_item, {
              content: transpileNode(item, indexArray.concat(idx)),
            })
          )
          .join("");

        const previousNode = getNodeByIndex(
          doc,
          indexArray.slice(0, -1).concat(indexArray[indexArray.length - 1] - 1)
        );

        console.log(previousNode)
        const nextNode = getNodeByIndex(
          doc,
          indexArray.slice(0, -1).concat(indexArray[indexArray.length - 1] + 1)
        );

        const isPreviousListSame = isSameListKind(previousNode, listKind);
        const isNextListSame = isSameListKind(nextNode, listKind);

        if (!isPreviousListSame) {
          result += rules.list[listKind].split("#content#")[0]
        }

        result += listItems;

        if (!isNextListSame) {
          result += rules.list[listKind].split("#content#")[1]
        }
        break;
      case "image":
        result = replacePlaceholders(rules.image, {
          src: node.attrs!.src,
          width: node.attrs!.width || "auto",
          height: node.attrs!.height || "auto",
        });
        break;
      case "table":
        const tableRows = node
          .content!.map((child, idx) =>
            transpileNode(child, indexArray.concat(idx))
          )
          .join("\n");
        const numColumns = node.content![0].content!.length;
        const columns = Array(numColumns).fill("X").join("|");
        result = replacePlaceholders(rules.table, {
          columns: columns,
          content: tableRows,
        });
        break;
      case "table_row":
        const tableCells = node
          .content!.map((cell, idx) =>
            transpileNode(cell, indexArray.concat(idx)).slice(0, -1)
          )
          .join(" & ");
        result = replacePlaceholders(rules.table_row, { content: tableCells });
        break;
      case "table_cell":
        result = replacePlaceholders(rules.table_cell, {
          content: node.content
            ? transpileNode(node.content[0], indexArray.concat(0))
            : "",
        });
        break;
      default:
        break;
    }

    return result;
  }

  latex += transpileNode(doc, []);
  return latex;
}

function generateLatexDocument(doc: DocumentNode, settings: Settings): string {
  const packages = Object.entries(settings.package)
    .map(([pkg, options]) => `\\usepackage[${options}]{${pkg}}`)
    .join("\n");
  const preamble = settings.preamble;
  const content = transpileDocument(doc, settings.rules, settings.config);

  return `\\documentclass{article}\n${packages}\n${preamble}\n\\begin{document}\n${content}\n\\end{document}`;
}

const latexDocument = generateLatexDocument(document, settings);
fs.writeFileSync("output.tex", latexDocument);

console.log("LaTeX document generated successfully!");
