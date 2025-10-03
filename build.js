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
const sourceFolder = path.join(__dirname, 'src');
const distFolder = path.join(__dirname, 'dist');

// Create dist folder if it doesn't exist
if (!fs.existsSync(distFolder)) {
  fs.mkdirSync(distFolder, { recursive: true });
}

// Utility function to read a file
const readFile = file => fs.readFileSync(path.join(sourceFolder, file), 'utf8');

// Minify and save a file
async function minifyFile(inputFile, outputFile, outputDir = distFolder) {
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
  console.log(`${combinedFile} created in src/ folder.`);

  // 2. Minify individual files to dist folder
  for (const file of files) {
    const name = path.basename(file, '.js');
    await minifyFile(file, `${name}.min.js`);
  }

  // 3. Minify combined file to dist folder
  await minifyFile(combinedFile, 'dom-helpers-combined.min.js');

  console.log('All files combined and minified successfully!');
}

// Run the build
build().catch(err => console.error(err));
