const fs = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const path = require('path');

const projectDistPath = path.join(__dirname, 'project-dist');
const indexHTMLPath = path.join(projectDistPath, 'index.html');
const stylePath = path.join(projectDistPath, 'style.css');
const assetsPath = path.join(projectDistPath, 'assets');

const templateHTMLPath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const sourceStylesPath = path.join(__dirname, 'styles');
const sourceAssetsPath = path.join(__dirname, 'assets');


let options = {
    encoding: 'utf8'
};

(async function buildPage() {
    try {
        await fs.mkdir(projectDistPath, { recursive: true });

        buildHTML();
        mergeStyles();
        copyAssets(sourceAssetsPath, assetsPath);
        
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
})()

async function buildHTML() {
    try {
        let mainHTML = await fs.readFile(templateHTMLPath, options);

        const files = await fs.readdir(componentsPath);
        for (let file of files) {
            let fileName = file.split('.')[0];
            let components = await fs.readFile(path.join(componentsPath, file), options);

            const entryIndex = mainHTML.indexOf(fileName);
            if (entryIndex != -1) {
                let leftPart = mainHTML.split('').slice(0, entryIndex - 2).join('');
                let rightPart = mainHTML.split('').slice(entryIndex + 2 + fileName.length).join('');
                mainHTML = leftPart + components + rightPart;
            }
        }

        const output = createWriteStream(indexHTMLPath);
        output.write(mainHTML);
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}

async function mergeStyles() {
    try {
        const output = createWriteStream(stylePath);

        const files = await fs.readdir(sourceStylesPath);
        for (const file of files) {
            const pathToFile = path.join(sourceStylesPath, file);
            const stats = await fs.stat(pathToFile);
            if (stats.isFile() && path.extname(pathToFile) == '.css') {
                const input = await fs.readFile(pathToFile, options);
                // const input = createReadStream(pathToFile, 'utf-8');
                output.write(input);
            }
        };
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}

async function copyAssets(from, to) {
    try {
        await fs.mkdir(to, { recursive: true });
        
        const files = await fs.readdir(from, { withFileTypes: true });
        for (let file of files) {
            if (file.isDirectory()) {
                copyAssets(
                    path.join(from, file.name),
                    path.join(to, file.name)
                );
            } else {
                await fs.copyFile(
                    path.join(from, file.name),
                    path.join(to, file.name)
                );
            }
        }
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}
