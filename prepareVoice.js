const axios = require("axios");
const { Buffer } = require("node:buffer");
const { MessageMedia } = require("whatsapp-web.js");
function prepareVoice(ctx) {
  return new Promise((resolve, reject) => {
    ctx.telegram
      // get the file id of the voice
      .getFileLink(ctx.update.channel_post.voice.file_id)
      .then((url) => {
        // request the voice from telegram via axios

        axios({ url, responseType: "arraybuffer" })
          .then((response) => {
            // convert the voice to base64

            myVoice = Buffer.from(response.data, "base64").toString("base64");
            // prepare the voice to be sent to whatsapp

            attachmentData = new MessageMedia("audio/ogg", myVoice, null, null);

            resolve({ attachmentData });
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = { prepareVoice };
