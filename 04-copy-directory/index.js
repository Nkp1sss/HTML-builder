const fs = require('fs/promises');
const path = require('path');

const sourcePath = path.join(__dirname, 'files');
const finalPath = path.join(__dirname, 'files-copy');

(async function copyDir() {
    try {
        await fs.rm(finalPath, { recursive: true, force: true });
        await fs.mkdir(finalPath, { recursive: true });

        const files = await fs.readdir(sourcePath);
        for (let file of files) {
            await fs.copyFile(
                path.join(sourcePath, file), 
                path.join(finalPath, file)
            );
        }
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
})()