import fs from 'fs';
import readline from "readline";

export const resetScreen = () => {
    const lines = process.stdout.getWindowSize()[1];
    for (let i = 0; i < lines; i++) {
        console.log('\r\n');
    }
    readline.cursorTo(process.stdout, 0, 0);
    printLogo();
}

export const printLogo = () => {
    const logo = fs.readFileSync('logo.txt').toString('utf8');
    console.log(logo);
}

export const log = (text, withLoader) => {
    process.stdout.write(`# ${text}${withLoader ? '' : '\n\n'}`);
    if (withLoader) {
        const interval = addLoader(text);
        return () => {
            clearInterval(interval);
            readline.cursorTo(process.stdout, text.length + 2);
            process.stdout.write('   ');
            readline.cursorTo(process.stdout, text.length + 2);
            process.stdout.write('\n\n');
        }
    }
}

const addLoader = (text) => {
    let x = 0;
    return setInterval(() => {
        if (x >= 3) {
            readline.cursorTo(process.stdout, text.length + 2);
            process.stdout.write('   ');
            readline.cursorTo(process.stdout, text.length + 2);
            x = 0;
        } else {
            process.stdout.write('.');
            x++;
        }
    }, 500);
}


