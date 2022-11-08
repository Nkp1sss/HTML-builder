const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const { stdin, stdout } = process;

stdout.write('Привет, введите текст.\nЧтобы выйти, введите exit или нажми Ctrl + C\n');

stdin.on('data', data => {
    if (data.toString().trim() == 'exit')
        process.exit();
    output.write(data);
});

process.on('exit', () => stdout.write('Пока..'));

process.on('SIGINT', function () {
    process.exit();
});