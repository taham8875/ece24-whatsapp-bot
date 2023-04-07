const axios = require("axios");
const { Buffer } = require("node:buffer");
const { MessageMedia } = require("whatsapp-web.js");
function prepareImage(ctx) {
  return new Promise((resolve, reject) => {
    ctx.telegram
      .getFileLink(
        // get the file id of the last image in the array, why the last image? because the last image is the highest resolution

        ctx.update.channel_post.photo[ctx.update.channel_post.photo.length - 1]
          .file_id
      )
      .then((url) => {
        // request the image from telegram via axios

        axios({ url, responseType: "arraybuffer" })
          .then((response) => {
            // convert the image to base64

            myImage = Buffer.from(response.data, "base64").toString("base64");
            // prepare the image to be sent to whatsapp

            attachmentData = new MessageMedia(
              "image/jpeg",
              myImage,
              null,
              null
            );

            let caption = ctx.update.channel_post.caption || "";

            resolve({ attachmentData, caption });
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

module.exports = { prepareImage };
