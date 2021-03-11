const path = require('path')
const fs = require('fs')

exports.getJsonFromFile = (file, filePath = '') => {
  let fileData = null;
  let filename = null;

  // Validation of file name, directory path, filename.
  // Getting filename
  try {
    filename = path.join(__dirname, filePath, file);
  } catch (err) {
    console.error(err, `; (__dirname: ${__dirname}, path = ${filePath}; file = ${file})`);
    throw new Error(`Wrong directory or file name (path = ${filePath}; file = ${file})`);
  }

  // Read filename
  try {
    fileData = fs.readFileSync(filename, 'utf-8');
  } catch (err) {
    console.error(err, `; (__dirname: ${__dirname}, filename: ${filename})`);
    throw new Error(`Error at reading filename (filename: ${filename}))`);
  }

  // Parse to JSON
  try {
    fileData = JSON.parse(fileData);
  } catch (err) {
    console.error(err);
    throw new Error(`Error at parsing read data to JSON`);
  }

  return fileData;
};
