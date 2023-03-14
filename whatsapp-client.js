const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const client = new Client();
// authStrategy: new LocalAuth(),
// puppeteer: { headless: false },
client.initialize();

client.on("loading_screen", (percent, message) => {
  console.log("LOADING SCREEN", percent, message);
});

client.on("qr", (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessful
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log("READY");
});

client.on("message_create", (msg) => {
  // Fired on all message creations, including your own
  if (msg.fromMe) {
    console.log("I SENT A MESSAGE:\n", msg);
  }
});

client.on("call", async (call) => {
  console.log("Call received, rejecting.", call);
  await call.reject();
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

module.exports = { client };
