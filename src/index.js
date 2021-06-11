import SlackBot from 'slackbots';
import { split } from 'rambda';
import { config } from 'dotenv';
import { firebase } from '@firebase/app';
import minimist from 'minimist';
import '@firebase/database';
import dispatcher from './dispatcher.js';

config();

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
});

const bot = new SlackBot({
  token: process.env.SLACK_TOKEN,
  name: process.env.SLACK_NAME
});

bot.on('open', () => console.log('Bot is Ready!'));

bot.on('message', async (data) => {
  if (data.type !== 'message' || data.subtype == 'bot_message' || !data.text) return;
  console.log(data)
  const dataFormatter = minimist(data.text.split(/\s/))
  const { _, ...args } = dataFormatter;
  const { user, channel } = data;
  const [command, subcommand] = dataFormatter["_"].slice(1)
  dispatcher({ bot, channel, user, command, subcommand, args });
});

bot.on('error', (error) => console.log(error));
