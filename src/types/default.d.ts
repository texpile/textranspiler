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
export type UploadResource = {
	type: 'image' | 'LaTeXEntry';
	file: string;
	content?: string;
	url?: string;
};
