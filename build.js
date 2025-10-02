// build.js
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

// List of your library files in order
const files = [
  'dom-helpers.js',
  'dom-helpers-storage.js',
  'dom-helpers-form.js',
  'dom-helpers-animation.js',
  'dom-helpers-components.js',
  'dom-helpers-reactive.js',
  'dom-helpers-async.js'
];

// Output folders
const sourceFolder = __dirname;
const minFolder = path.join(__dirname, 'helpers-min');

// Create minified folder if it doesn't exist
if (!fs.existsSync(minFolder)) {
  fs.mkdirSync(minFolder, { recursive: true });
}

// Utility function to read a file
const readFile = file => fs.readFileSync(path.join(__dirname, file), 'utf8');

// Minify and save a file
async function minifyFile(inputFile, outputFile, outputDir = minFolder) {
  const code = readFile(inputFile);
  const minified = await minify(code, {
    compress: true,
    mangle: true,
    output: {
      comments: false
    }
  });
  fs.writeFileSync(path.join(outputDir, outputFile), minified.code, 'utf8');
  console.log(`${outputFile} created in ${outputDir}`);
}

// Combine files
async function build() {
  // 1. Combine all files
  let combinedCode = '';
  for (const file of files) {
    combinedCode += readFile(file) + '\n';
  }
  const combinedFile = 'dom-helpers-combined.js';
  fs.writeFileSync(path.join(sourceFolder, combinedFile), combinedCode, 'utf8');
  console.log(`${combinedFile} created in source folder.`);

  // 2. Minify individual files to helpers-min folder
  for (const file of files) {
    const name = path.basename(file, '.js');
    await minifyFile(file, `${name}.min.js`);
  }

  // 3. Minify combined file to helpers-min folder
  await minifyFile(combinedFile, 'dom-helpers-combined.min.js');

  console.log('All files combined and minified successfully!');
}

// Run the build
build().catch(err => console.error(err));
