export interface DocumentNode {
  type: string;
  attrs?: { [key: string]: any };
  content?: DocumentNode[];
  text?: string;
  marks?: { type: string }[];
}

export type UploadResource = {
  type: 'image' | 'LaTeXEntry';
  file: string;
  content?: string;
  url?: string;
};

export interface DocumentSettings {
  version: number;
  documentclass: string;
  package: { [key: string]: string };
  preamble: string;
  document: string;
  config: {
    sanitizetext: boolean;
    splitconnectedlines: {
      character: number;
      command: string;
    };
    escapesequences: { [key: string]: string };
  };
  rules: {
    heading: { [key: string]: string };
    paragraph: string;
    code_block: string;
    inline_math: string;
    block_math: string;
    blockquote: string;
    list: {
      ordered: string;
      bullet: string;
    };
    list_item: string;
    nolabel_list_item: string;
    image: {
      center: string;
      margin: string;
      left: string;
      right: string;
    };
    table: string;
    table_row: string;
    table_cell: string;
    citation: string;
    marks: {
      strong: string;
      em: string;
      u: string;
      code: string;
      a: string;
    };
  };
}
