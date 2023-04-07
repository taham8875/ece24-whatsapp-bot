// host on glitch.com, to make it work 24/7 we need to ping it every 5 minutes
const https = require("https");
const express = require("express");
const app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(3000);

// the app somehow recognizes if bot or human is using it, so we need to add a user agent to make it think we are a human
const options = {
  headers: {
    "User-Agent": "Mozilla/5.0",
  },
};

function pingGlitchForever(bot) {
  setInterval(() => {
    https.get(
      `https://${process.env.GLITCH_DOMAIN}.glitch.me`,
      options,
      (res) => {
        console.log(`Response status: ${res.statusCode}`);
        // tell me if the bot is working, to know i should restart it if it's not
        bot.telegram.sendMessage(
          process.env.MY_NUMBER,
          `Second Bot Is Working ${res.statusCode}`
        );
      }
    );
  }, 240000);

  return true;
}

module.exports = { pingGlitchForever };
