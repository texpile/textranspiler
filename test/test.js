const fs = require('fs');
const document = require('./sample/test.json');
const settings = require('./settings/default.json');
const { generateLatexDocument } = require('../build/bundle.min.js');

async function main() {
  const latexDocument = await generateLatexDocument(document, settings);
  fs.writeFileSync('output.tex', latexDocument);
  console.log('LaTeX document generated successfully!');
}

main().catch(console.error);
