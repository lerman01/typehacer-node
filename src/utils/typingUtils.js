import {getRandomInt} from "./utils.js";
import {CONFIG_VARS, CONFIG, PAGE} from "../index.js";

export const typeText = async (raceText) => {
    for (const character of raceText) {
        if (shouldDoError()) {
            await doError();
        }
        await PAGE.keyboard.type(character, {
            delay: getRandomInt(CONFIG.get(CONFIG_VARS.MIN_SPEED), CONFIG.get(CONFIG_VARS.MAX_SPEED))
        });
        process.stdout.write(character);
    }
    process.stdout.write('\n\n');
}

export const doError = async () => {
    const errorsAmount = getRandomInt(1, 5);

    for (let i = 0; i < errorsAmount; i++) {
        const errorCharacter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
        await PAGE.keyboard.type(errorCharacter, {
            delay: getRandomInt(CONFIG.get(CONFIG_VARS.MIN_SPEED), CONFIG.get(CONFIG_VARS.MAX_SPEED))
        });

    }

    for (let i = 0; i < errorsAmount; i++) {
        await PAGE.keyboard.press('Backspace', {
            delay: getRandomInt(CONFIG.get(CONFIG_VARS.MIN_SPEED), CONFIG.get(CONFIG_VARS.MAX_SPEED))
        });
    }
}

export const shouldDoError = () => {
    const randomInt = getRandomInt(0, 100);
    return randomInt < CONFIG.get(CONFIG_VARS.ERROR_RATE);
}