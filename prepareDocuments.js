const axios = require("axios");
const { Buffer } = require("node:buffer");
const { MessageMedia } = require("whatsapp-web.js");
function prepareDocument(ctx) {
  return new Promise((resolve, reject) => {
    ctx.telegram
      // get the file id of the document
      .getFileLink(ctx.update.channel_post.document.file_id)
      .then((url) => {
        // request the document from telegram via axios

        axios({ url, responseType: "arraybuffer" })
          .then((response) => {
            // convert the document to base64

            myDocument = Buffer.from(response.data, "base64").toString(
              "base64"
            );
            // prepare the document to be sent to whatsapp

            attachmentData = new MessageMedia(
              ctx.update.channel_post.document.mime_type,
              myDocument,
              ctx.update.channel_post.document.file_name,
              null
            );

            let caption = ctx.update.channel_post.caption;

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

module.exports = { prepareDocument };
