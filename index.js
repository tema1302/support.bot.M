const TelegramBot = require('node-telegram-bot-api');
const languageAndInit = require('./languageAndInit');
const i18n = require('./config/i18n');

const token = '6336765125:AAGduWrAO6jW5HAUS5cqSeg7R0RbfAJOU7M'; // Замените на ваш токен
const bot = new TelegramBot(token, { polling: true });

const menuHandler = require('./menuHandler');
const support = require('./support');
const promotions = require('./promotions');

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

  bot.onText(/\/(connect|support|channel|about|promotions|unsubscribe)/, (msg, match) => {
    const command = match[0].replace('/', '');
    switch (command) {
      case 'connect':
        menuHandler.displayConnectionOptions(bot, msg);
        break;
      case 'support':
        support.startSupportScenario(bot, msg);
        break;
      case 'channel':
        menuHandler.handleChannelInfo(bot, msg);
        break;
      case 'about':
        menuHandler.displayAboutInfo(bot, msg);
        break;
      case 'promotions':
        promotions.displayPromotions(bot, msg.chat.id);
        break;
      case 'unsubscribe':
        console.log(menuHandler);
        menuHandler.handleUnsubscribe(bot, msg);
        break;
      default:
        // Действие по умолчанию, если команда не распознана
        console.log(`Команда ${command} не распознана.`);
    }
  });
  

  languageAndInit.initialize(bot);
} catch (e) {
  console.log("----------- ERROR -----------");
  console.error('An error occurred: ', e);
  console.log("----------- /ERROR -----------");
}
