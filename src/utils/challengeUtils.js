import fetch from "node-fetch";
import {log} from "./cliUtils.js";
import {CONFIG_VARS, CONFIG, PAGE, closePopup} from "../index.js";
import {typeText} from "./typingUtils.js";

export const handleChallenge = async () => {
    if (CONFIG.get(CONFIG_VARS.GOOGLE_API_TOKEN)) {
        const stopLoader = log('Start anaylze challenge text', true);
        await PAGE.click('.dialogContent button');
        await PAGE.waitForSelector('.dialogContent img');
        const imgUrl = await PAGE.evaluate(() => document.querySelector('.dialogContent img').src);
        const response = await fetch(imgUrl);
        const imageData = await response.arrayBuffer();
        const imageText = await getImageText(imageData);
        stopLoader();
        log('Challenge type:')
        await typeText(imageText);
        await PAGE.click('.dialogContent button');
        await closePopup();
    } else {
        await PAGE.click('.dialogContent button');
        const submitButton = await PAGE.waitForSelector('.dialogContent button');
        await submitButton.click();
        await closePopup();
    }
}

const getImageText = async (imageData) => {
    const base64String = Buffer.from(imageData).toString('base64');
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${CONFIG.get(CONFIG_VARS.GOOGLE_API_TOKEN)}`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            requests: [{
                image: {
                    content: base64String
                },
                features: [{"type": "TEXT_DETECTION"}]
            }]
        })
    });
    const responseBody = await response.json();
    return responseBody.responses[0].fullTextAnnotation.text.replace('\n', ' ');
}
