const fs = require('fs');
const path = require('path');

const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
// const readableStream = fs.createReadStream('./01-read-file/text.txt', 'utf-8');

let body = '';
readableStream.on('data', chunk => body += chunk);
readableStream.on('end', () => console.log(body));
readableStream.on('error', error => console.log('Error', error.message));
