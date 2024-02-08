const TelegramBot = require('node-telegram-bot-api');
const languageSelection = require('./languageSelection');
const i18n = require('./config/i18n');

const token = '6336765125:AAGduWrAO6jW5HAUS5cqSeg7R0RbfAJOU7M'; // Замените на ваш токен
const bot = new TelegramBot(token, { polling: true });

const menuHandler = require('./menuHandler');
const supportHandler = require('./supportHandler');
const connectionHandler = require('./connectionHandler');

const commands = [
  {
      command: "start",
      description: "Запуск бота"
  },
  {
      command: "connect",
      description: i18n.__('connect')
  },
  {
      command: "support",
      description: i18n.__('support')
  },
  {
      command: "channel",
      description: i18n.__('channel')
  },
  {
      command: "about",
      description: i18n.__('about_us')
  },
  {
      command: "promotions",
      description: i18n.__('promotions')
  },
  {
      command: "unsubscribe",
      description: i18n.__('unsubscribe')
  }
];

try {
  bot.setMyCommands(commands);

  // Обработка команды /connect
  bot.onText(/\/connect/, (msg) => {
    menuHandler.displayConnectionOptions(bot, msg);
  });

  // Обработка команды /support
  bot.onText(/\/support/, (msg) => {
    supportHandler.startSupportScenario(bot, msg);
  });

  // Обработка команды /channel
  bot.onText(/\/channel/, (msg) => {
    menuHandler.handleChannelInfo(bot, msg);
  });

  bot.onText(/\/about/, (msg) => {
    menuHandler.displayAboutInfo(bot, msg);
  });

  bot.onText(/\/promotions/, (msg) => {
    menuHandler.displayPromotions(bot, msg);
  });

  // Обработка команды /unsubscribe
  bot.onText(/\/unsubscribe/, (msg) => {
    console.log(menuHandler);
    menuHandler.handleUnsubscribe(bot, msg);
  });

  languageSelection.initialize(bot);
} catch (e) {
  console.log("----------- ERROR -----------");
  console.error('An error occurred: ', error);
  console.log("----------- /ERROR -----------");
}
