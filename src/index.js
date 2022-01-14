import puppeteer from "puppeteer-extra";
import stealthPlugin from 'puppeteer-extra-plugin-stealth'
import propertiesReader from 'properties-reader';
import {log, resetScreen} from "./utils/cliUtils.js";
import {handleChallenge} from "./utils/challengeUtils.js";
import {sleep} from "./utils/utils.js";
import {typeText} from "./utils/typingUtils.js";

puppeteer.use(stealthPlugin())

export const CONFIG_VARS = {
    MIN_SPEED: 'MIN_SPEED',
    MAX_SPEED: 'MAX_SPEED',
    ERROR_RATE: 'ERROR_RATE',
    GOOGLE_API_TOKEN: 'GOOGLE_API_TOKEN',
}

export let CONFIG;
export let BROWSER;
export let PAGE;

const start = async () => {
    resetScreen();
    await initApp();
    await PAGE.goto('https://play.typeracer.com/');
    await startRace();
    while (true) {
        await waitForGameToStart();
        const raceText = await getRaceText();
        await PAGE.click('.txtInput');
        log('Start typing: ');
        await typeText(raceText);
        await handlePopup();
        await clickRaceAgain();
        await handlePopup();
        resetScreen();
    }
}


const waitForGameToStart = async () => {
    const stopLoader = log('Waiting for game to start', true);
    while (true) {
        const isGameStarted = await PAGE.evaluate(() => document.activeElement?.tagName === 'INPUT');
        await sleep(100);
        if (isGameStarted) {
            stopLoader();
            break;
        }
    }
}

const clickRaceAgain = async () => {
    while (true) {
        const isButtonAppeared = await PAGE.evaluate(() => document.querySelector('.raceAgainLink').style.display !== 'none');
        if (isButtonAppeared) {
            break;
        }
    }
    await PAGE.click('.raceAgainLink');
}

const initApp = async () => {
    CONFIG = propertiesReader('config.properties');
    BROWSER = await puppeteer.launch({
        headless: false,
        userDataDir: 'data_dir',
        args: [`--window-size=1400,1000`,
            // "--window-position=-1500,0"
        ]
    });

    const [page] = await BROWSER.pages();
    PAGE = page;
}

const getRaceText = async () => {
    return await PAGE.evaluate(() => document.querySelector('table.inputPanel div').textContent);
}

const startRace = async () => {
    const startGameButton = await PAGE.waitForSelector('.gwt-Anchor.prompt-button.bkgnd-green');
    await startGameButton.click();
    await PAGE.waitForSelector('.gameView');
}

const handlePopup = async () => {
    let popupElement;
    try {
        popupElement = await PAGE.waitForSelector('.DialogBox .Caption', {timeout: 2000});
    } catch (e) {
        return false;
    }
    const popupTitle = await popupElement.evaluate(e => e.textContent);
    switch (popupTitle) {
        case 'Typing Challenge':
            await handleChallenge();
            break;
        case "Get your FREE TypeRacer account!":
            await closePopup();
    }
}

export const closePopup = async () => {
    const xButton = await PAGE.waitForSelector('.xButton');
    await sleep(5000);
    await xButton.click();
}

start();

