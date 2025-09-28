Combine all four dom-helpers libraries in the correct order.

Minify each individual library.

Minify the combined library.

Produce .min.js files ready for production.

Save this script as build.js in the same folder as your library files.

// build.js
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

// List of your library files in order
const files = [
  'dom-helpers.js',
  'dom-helpers-animation.js',
  'dom-helpers-form.js',
  'dom-helpers-storage.js'
];

// Output folder (optional)
const outputFolder = __dirname;

// Utility function to read a file
const readFile = file => fs.readFileSync(path.join(__dirname, file), 'utf8');

// Minify and save a file
async function minifyFile(inputFile, outputFile) {
  const code = readFile(inputFile);
  const minified = await minify(code, {
    compress: true,
    mangle: true
  });
  fs.writeFileSync(path.join(outputFolder, outputFile), minified.code, 'utf8');
  console.log(`${outputFile} created.`);
}

// Combine files
async function build() {
  // 1. Combine all files
  let combinedCode = '';
  for (const file of files) {
    combinedCode += readFile(file) + '\n';
  }
  const combinedFile = 'dom-helpers-combined.js';
  fs.writeFileSync(path.join(outputFolder, combinedFile), combinedCode, 'utf8');
  console.log(`${combinedFile} created.`);

  // 2. Minify individual files
  for (const file of files) {
    const name = path.basename(file, '.js');
    await minifyFile(file, `${name}.min.js`);
  }

  // 3. Minify combined file
  await minifyFile(combinedFile, 'dom-helpers-combined.min.js');

  console.log('All files combined and minified successfully!');
}

// Run the build
build().catch(err => console.error(err));


**How to use

Make sure Node.js is installed:

node -v
npm -v


Install terser locally or globally:

npm install terser


Place all your library files in the same folder as build.js.

Run the build script:

node build.js


You will get:

dom-helpers.min.js

dom-helpers-animation.min.js

dom-helpers-form.min.js

dom-helpers-storage.min.js

dom-helpers-combined.js (unminified combined)

dom-helpers-combined.min.js (minified combined for production)


Option B: Automatic combination using Node.js

Make sure Node.js
 is installed.

Create a combine.js script in the same folder as your libraries:

const fs = require('fs');
const path = require('path');

const files = [
  'dom-helpers.js',
  'dom-helpers-animation.js',
  'dom-helpers-form.js',
  'dom-helpers-storage.js'
];

let combined = '';

files.forEach(file => {
  combined += fs.readFileSync(path.join(__dirname, file), 'utf8') + '\n';
});

fs.writeFileSync(path.join(__dirname, 'dom-helpers-combined.js'), combined);

console.log('Combined file created successfully!');


Open PowerShell (or terminal), navigate to your project folder:

cd "C:\path\to\your\project"


Run the script:

node combine.js


✅ A new dom-helpers-combined.js will appear, ready to include in your HTML.

Step 3: Minify libraries for production

Minifying reduces file size and improves load time. We recommend using Terser
.

Install Terser
npm install -g terser

Minify individual files
terser dom-helpers.js -o dom-helpers.min.js -c -m
terser dom-helpers-animation.js -o dom-helpers-animation.min.js -c -m
terser dom-helpers-form.js -o dom-helpers-form.min.js -c -m
terser dom-helpers-storage.js -o dom-helpers-storage.min.js -c -m

Minify combined file
terser dom-helpers-combined.js -o dom-helpers-combined.min.js -c -m


✅ You can now include dom-helpers-combined.min.js in your HTML for production:

<script src="dom-helpers-combined.min.js"></script>

Step 4: Recommended HTML setup

For development (easier debugging):

<script src="dom-helpers.js"></script>
<script src="dom-helpers-animation.js"></script>
<script src="dom-helpers-form.js"></script>
<script src="dom-helpers-storage.js"></script>


For production (optimized, single file):

<script src="dom-helpers-combined.min.js"></script>

Step 5: Notes & Best Practices

Maintain the order when combining: core → animation → form → storage.

Keep libraries vanilla JS—no frameworks—so you don’t lose core JS skills.

Use minified files only in production.

Always test functionality after combining/minifying to catch any dependency issues.
