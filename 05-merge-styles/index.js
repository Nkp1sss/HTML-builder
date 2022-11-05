const fs = require('fs/promises');
const { createWriteStream, createReadStream } = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'styles');
const finalPath = path.join(__dirname, 'project-dist');


(async function mergeStyles() {
    try {
        const output = createWriteStream(path.join(finalPath, 'bundle.css'));
        
        const files = await fs.readdir(sourcePath);

        for (const file of files) {
            const pathToFile = path.join(sourcePath, file);
            const stats = await fs.stat(pathToFile);
            if (stats.isFile() && path.extname(pathToFile) == '.css') {
                const input = createReadStream(pathToFile, 'utf-8');
                input.pipe(output);
            }
        };
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
})()
