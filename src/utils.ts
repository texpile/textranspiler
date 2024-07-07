import { DocumentNode } from "./types/default";

export function replacePlaceholders(
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

export function sanitizeText(text: string): string {
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

export function getNodeByIndex(
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

export function isSameListKind(node: DocumentNode | null, kind: string) {
  return node && node.type === "list" && node.attrs!.kind === kind;
}
sanitizeText