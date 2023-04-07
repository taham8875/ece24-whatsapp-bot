# ECE24 Whatsapp bot

<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
    <img src="/README/walogo.png" alt="Logo" width="80" height="80">
    <img src="/README/telegraflogo.svg" alt="Logo" width="80" height="80">
</div>

Hi there, this is my latest project, a Whatsapp bot that can be used to get forward messages from [ECE24 telegeram channel](https://t.me/comm24) (Electronics and Communications department, Faculty of engineering, Alexandria University, Class 24) to ECE24 whatsapp community, the goal is to automate the process of communicationg with the student on different platforms via one click. The bot is written in node.js and uses the [Telegraf](https://github.com/telegraf/telegraf) library to listen to the messages and send the to whatsapp with the [Whatsapp web js](https://github.com/pedroslopez/whatsapp-web.js) library. The bot is currently hosted on glitch and can be used by anyone with a Whatsapp account.


## Demo







### Installation




##### To test locally 

Create you own telegram bot by [BotFather](https://t.me/BotFather) and add the token to the .env file

make the bot admin in the telegram channel you want to listen to.

add the id of the whatsapp recepient you want to send the messages to in the .env file (How to get the id ? You need to activate the client, then send a message to the target and then check the console for the id(You will need to write some code and figure it out yourself))


* npm
  ```sh
  npm install npm@latest -g
  ```

1. Clone the repo
   ```sh
   git clone https://github.com/taham8875/ece24-whatsapp-bot.git
   ```
1. Install NPM packages
   ```sh
   npm install
   ``` 

1. Start the bot
   ```sh
   npm index.js
   ```

You will be asked to scan the QR code to login to whatsapp web, after that you can start sending messages to the telgram channel and it will forward them to the whatsapp group. You need to signin once, afterwords the bot will save the session and you can restart the bot without scanning the QR code again.

### Disclaimer
This project is for my use, not a ready for production bot or some sort of ready-to-use library, i customized it a lot for me, you need to make some changes to the code to make it work for you. (And i will really be surprised if anyone find this repo and want to use it, but if you do, feel free to open an issue or a pull request)
