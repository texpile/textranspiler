export interface DocumentNode {
  type: string;
  attrs?: { [key: string]: any };
  content?: DocumentNode[];
  text?: string;
  marks?: { type: string }[];
}

export interface Settings {
  package: { [key: string]: string };
  preamble: string;
  config: {
    sanitizetext: boolean;
  };
  rules: {
    [key: string]: any;
  };
}
