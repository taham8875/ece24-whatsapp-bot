/**
 * Title: index.js
 * Description: This is the main file for the ece24bot telegram-whatsapp bot.
 * Author: Taha Ahmed
 * Date: March 2023
 */

// to import the .env file variables
require("dotenv").config();

// telegram bot
const { Telegraf } = require("telegraf");

// import from whatsappClient.js
const { whatsappClient } = require("./whatsappClient");

// import from pingGlitchForever.js
// no need to use if your server is always on forever, in my case, I use glitch.com and it sleeps after 5 minutes of inactivity, so I need to ping it every 5 minutes to keep it awake
// const { pingGlitchForever } = require("./pingGlitchForever");

// start coding

// Create a new telegram bot
const bot = new Telegraf(process.env.TELEGRAM_ECE24BOT_TOKEN);
console.log("Bot has started...");

let client = null;

// queue to store the ctx objects, so we can send them to whatsapp after the client is ready
let ctxQueue = [];
let ctxCount = 0;

// we close the client when all the messages are sent, so we need to keep track of the number of messages sent
let ackCount = 0;

/*
we close the client after sending messages so that it doesn't consume much memory on glitch and crash
and since i expect the client to work for seconds a day, i think it may be a good design not to keep the bot alive forever, search for `serverless computing` 
*/

bot.on("channel_post", async (ctx) => {
  console.log("ctx ->", ctx.update.channel_post);

  // push the ctx object to the queue
  ctxQueue.push(ctx);
  console.log("ctxQueue ->", ctxQueue);
  ctxCount++;

  // check if the message contains documents, if so, decrease ackCount by 1 because we don't want to destroy the client until the document and its caption is sent (we send the document and its caption as two separate messages)
  if (ctx.update.channel_post.document && ctx.update.channel_post.caption) {
    ackCount--;
  }
  if (!client) {
    // create a new client and send the messages in the queue
    client = whatsappClient(ctxQueue);
    // listen for the message ack event to know when the message is sent, if the same number of messages acknolwedged as the number of messages sent, then destroy the client
    client.on("message_ack", (msg, ack) => {
      /*
      == ACK VALUES ==
      ACK_ERROR: -1
      ACK_PENDING: 0
      ACK_SERVER: 1
      ACK_DEVICE: 2
      ACK_READ: 3
      ACK_PLAYED: 4
      */
      if (ack === 1) {
        ackCount++;
        if (ackCount === ctxCount) {
          client.destroy();
          client = null;
          ctxQueue = [];
        }
      }
    });
  }
});

bot.launch();

// ping glitch forever
// not needed of your server is always on by default
// pingGlitchForever(bot);

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
