const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { exec } = require('child_process');
const input = require("input");
const fs = require("fs");
require('colors');

const configPath = "./config.json";
let config = require(configPath);
const maxAttempts = 3;
let attemptCount = 0;

async function time() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
}

function openUrl() {
  try {
    let command;

    if (process.platform === 'win32') {
      command = `start`;
    } else if (process.platform === 'darwin') {
      command = `open`;
    } else {
      command = `xdg-open`;
    }

    exec(`${command} https://github.com/originels`, (err) => { });
  } catch (error) { }
}

async function login() {
  if (attemptCount >= maxAttempts) {
    console.log(`[CMD]`.brightMagenta + ` =>`.grey + ` [${await time()}]`.brightMagenta + " Maximum attempts reached. Exiting script.".red);
    process.exit(1);
  }

  attemptCount++;
  config = require(configPath);
  const apiId = config.id;
  const apiHash = config.hash;

  const phoneNumber = config.phone.number && config.phone.prefix
    ? `+${config.phone.prefix}${config.phone.number}`
    : `+${config.phone}`;

  const stringSession = new StringSession(config.session && config.session !== "" ? config.session : "");

  const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });

  try {
    await client.start({
      phoneNumber: async () => phoneNumber,
      password: async () => await input.text(`[CMD]`.brightMagenta + ` =>`.grey + ` [${await time()}]`.brightMagenta + " Password (if enabled) : ".green),
      phoneCode: async () => {
        const code = await input.text(`[CMD]`.brightMagenta + ` =>`.grey + ` [${await time()}]`.brightMagenta + " Received code : ".green);
        if (!code) throw new Error("Empty code received.");
        return code;
      },
      onError: (err) => console.log("Authentication error :", err),
    });

    const me = await client.getMe();
    console.clear();
    console.log(`[CMD]`.brightMagenta + ` =>`.grey + ` [${await time()}]`.brightMagenta + ` Connected as ${me.username}`.green);

    config.session = client.session.save();
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    const sourceChannelId = -1002641846014;
    const messages = await client.getMessages(sourceChannelId, { limit: 100, reverse: true });

    if (messages.length > 0) {
      const firstMessage = messages[1];

      const transferToAll = async () => {
        const dialogs = await client.getDialogs();
        for (let dialog of dialogs) {
          if ((dialog.isChannel || dialog.isGroup) && dialog.id !== sourceChannelId) {
            try {
              const fromPeer = await client.getInputEntity(sourceChannelId);
              const toPeer = await client.getInputEntity(dialog.id);
              await client.invoke(new Api.messages.ForwardMessages({
                fromPeer: fromPeer,
                toPeer: toPeer,
                id: [firstMessage.id],
                randomId: [BigInt(Date.now())],
              }));
              console.log(`[CMD]`.brightMagenta + ` =>`.grey + ` [${await time()}]`.brightMagenta + ` Forwarded to ${dialog.title}`.green);
            } catch (err) {}
          }
        }
      };

      await transferToAll();
      setInterval(transferToAll, 10 * 60 * 1000);
    } else {
      console.log(`[CMD]`.brightMagenta + ` =>`.grey + ` [${await time()}]`.brightMagenta + " No messages found in source channel.".red);
    }

  } catch (err) {
    console.log(`[CMD]`.brightMagenta + ` =>`.grey + ` [${await time()}]`.brightMagenta + ` Connection error : ${err.message}`.red);

    config.session = false;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    if (attemptCount < maxAttempts) {
      console.log(`[CMD]`.brightMagenta + ` =>`.grey + ` [${await time()}]`.brightMagenta + ` Retry #${attemptCount} in 2s...`.yellow);
      setTimeout(login, 2000);
    } else {
      console.log(`[CMD]`.brightMagenta + ` =>`.grey + ` [${await time()}]`.brightMagenta + " Maximum attempts reached. Exiting script.".red);
      process.exit(1);
    }
  }
}

openUrl();
login();