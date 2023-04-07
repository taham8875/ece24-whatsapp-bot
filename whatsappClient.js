const { Client, LocalAuth } = require("whatsapp-web.js");
const axios = require("axios");

// to login with whatsapp number, scan the qrcode, so we convert the link to qr to scan with phone
const qrcode = require("qrcode-terminal");

// import prepare functions
const { prepareImage } = require("./prepareImage");
const { prepareDocument } = require("./prepareDocuments");
const { prepareVoice } = require("./prepareVoice");

function whatsappClient(ctxQueue) {
  client = new Client({
    authStrategy: new LocalAuth(),
    // in case you are developing on your machine and want to see the browser, uncomment the following line
    // puppeteer: { headless: false },
    // in case you are using a system without GUI (for example linux server images that can just be accessed over a shell and dont have something like a desktop)  , following line is good, [read https://wwebjs.dev/guide/#installation-on-no-gui-systems]
    puppeteer: {
      args: ["--no-sandbox"],
    },
  });

  client.initialize();

  console.log("CLIENT INITIALIZED ", client);

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("READY");

    for (const ctx of ctxQueue) {
      // determine the recipient based on the sender
      let sender = ctx.update.channel_post.sender_chat.title;
      let recipient = null;
      if (sender == "TestECE24Channel") {
        recipient = process.env.TEST_ANNOUNCMENT_GROUP_ID;
      } else if (sender == "Communications 24") {
        recipient = process.env.COMMUNICATION_24_ANNOUNCMENT_GROUP_ID;
      }

      // check if the message contains images or documents or voice
      const containesImages = ctx.update.channel_post.photo;
      const containesDocuments = ctx.update.channel_post.document;
      const isVoice = ctx.update.channel_post.voice;

      // if the message contains no images or documents send the message text
      if (!containesImages && !containesDocuments && !isVoice) {
        let message = ctx.update.channel_post.text;
        client.sendMessage(recipient, message);
      } else if (containesImages) {
        prepareImage(ctx)
          .then(({ attachmentData, caption }) => {
            client.sendMessage(recipient, attachmentData, { caption: caption });
          })
          .catch((error) => {
            console.error(error);
          });
      } else if (containesDocuments) {
        prepareDocument(ctx)
          .then(({ attachmentData, caption }) => {
            // since captions of documents is not working on the library, we send the caption as a seperated message
            if (caption) {
              client.sendMessage(recipient, caption);
            }
            client.sendMessage(recipient, attachmentData);
          })
          .catch((error) => {
            console.error(error);
          });
      } else if (isVoice) {
        prepareVoice(ctx)
          .then(({ attachmentData }) => {
            client.sendMessage(recipient, attachmentData);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  });

  client.on("message_create", (msg) => {
    // Fired on all message creations, including your own
    if (msg.fromMe) {
      console.log("WHATSAPP SENT A MESSAGE:\n", msg);
    }
  });

  client.on("call", async (call) => {
    await call.reject();
  });

  return client;
}

module.exports = { whatsappClient };
