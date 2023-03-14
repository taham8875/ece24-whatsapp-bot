const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const axios = require("axios");
const { Buffer } = require("node:buffer");
const { MessageMedia } = require("whatsapp-web.js");

const { client } = require("./whatsapp-client.js");
const {
  TELEGRAM_BOT_TOKEN,
  COMMUNICATION_24_ANNOUNCMENT_GROUP_ID,
  TEST_ANNOUNCMENT_GROUP_ID,
} = require("./CONFIG.js");
const util = require("util");
// console.log("client", client);

const number = COMMUNICATION_24_ANNOUNCMENT_GROUP_ID;

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

console.log("BOT IS INITIALIZED", bot);

bot.on("channel_post", async (ctx) => {
  // Explicit usage
  console.log("\n ctx\n");
  console.log(ctx.update.channel_post);

  const containesImages = ctx.update.channel_post.photo;
  const containesDocuments = ctx.update.channel_post.document;

  if (!containesImages && !containesDocuments) {
    let message = ctx.update.channel_post.text;
    client.sendMessage(
      number,
      `${message}\n\n\`\`\`Author : ${ctx.update.channel_post.author_signature}\`\`\``
    );
  } else if (containesImages) {
    ctx.telegram
      .getFileLink(
        ctx.update.channel_post.photo[ctx.update.channel_post.photo.length - 1]
          .file_id
      )
      .then((url) => {
        axios({ url, responseType: "arraybuffer" }).then((response) => {
          return new Promise((resolve, reject) => {
            myImage = Buffer.from(response.data, "base64").toString("base64");
            attachmentData = {
              mimetype: "image/jpeg",
              data: myImage,
              filename: null,
              filesize: null,
            };
            attachmentData = new MessageMedia(
              "image/jpeg",
              myImage,
              null,
              null
            );
            let caption = ctx.update.channel_post.caption;
            client.sendMessage(number, attachmentData, {
              caption: `${caption || ""}\n\n\`\`\`Author : ${
                ctx.update.channel_post.author_signature
              }\`\`\``,
            });
          });
        });
      });
  } else if (containesDocuments) {
    ctx.telegram
      .getFileLink(ctx.update.channel_post.document.file_id)
      .then((url) => {
        axios({ url, responseType: "arraybuffer" }).then((response) => {
          return new Promise((resolve, reject) => {
            console.log("response.data", response.data);
            myDocument = Buffer.from(response.data, "base64").toString(
              "base64"
            );
            attachmentData = new MessageMedia(
              "application/pdf",
              myDocument,
              ctx.update.channel_post.document.file_name || "",
              null
            );
            let caption = ctx.update.channel_post.caption;
            client.sendMessage(number, attachmentData, {
              caption: `${caption || ""}\n\n\`\`\`Author : ${
                ctx.update.channel_post.author_signature
              }\`\`\``,
            });
          });
        });
      });
  }

  // console.log("\n author_signature", ctx.update.channel_post.author_signature);
  // // console.log("\n ctx.text", ctx.update.channel_post.text);
  // // console.log("\n ctx.date", ctx.update.channel_post.date);
  // let number = "";
  //
  // number = number.includes("@g.us") ? number : `${number}@g.us`;
  // console.log("number", number, "message", message);
  // client.sendMessage(
  //   number,
  //   `${message}\n\n\`\`\`Author : ${ctx.update.channel_post.author_signature}\`\`\``
  // );
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
