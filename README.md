
# TypeHacker-Node

Cheating https://typeracer.com including challenge cheat.


## Quick Start
1. Install NodeJS (https://nodejs.org/)
2. Clone project
3. Run `npm install`
4. Execute `start.bat`

## Configuration
You can change app beviour using the `config.properties` file 

- `MIN_SPEED, MAXSPEED`- these values represent the speed of typing, each time the app typing character it will pick random number between MINSPEED-MAXSPEED and this value will be the delay time of the typed character (milliseconds). higher values means slower typing.
- `ERROR_RATE`- The app can mimic human typing mistakes, this value can be 0-100 and it will represent the percentage amount of mistakes that the app will do in the game.
- `GOOGLE_API_TOKEN`- In order to solve the challenge in the game you must provide google cloud api key. See [Solving Challenge](#Solving-Challenge)

## Solving Challenge

The app using Google API OCR services in order to convert the image to text.
In order to use this feature you must provide Google Cloud API key.

You can create API Key here: https://console.cloud.google.com/apis/credentials

If you choose to restriced the key make sure it will have `Compute Engine API`.
