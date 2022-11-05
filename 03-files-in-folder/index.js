const fs = require('fs/promises');
const path = require('path');

const folder = 'secret-folder';
const fullPath = path.join(__dirname, folder);

/** С async/await */
(async function readDir() {
    try {
        const files = await fs.readdir(fullPath);
        for (const file of files) {
            const stats = await fs.stat(path.join(fullPath, file));
            if (stats.isFile()) {
                const ext = path.extname(path.join(fullPath, file))
                .slice(1);
                console.log(`${file.split('.')[0]} - ${ext} - ${(stats.size / 1024)
                .toFixed(3)}kb`);
            }
        };
    } catch (err) {
        console.error(err);
    }
})()
