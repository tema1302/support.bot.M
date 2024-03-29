const TelegramBot = require('node-telegram-bot-api');
const languageAndInit = require('./languageAndInit');
const i18n = require('./config/i18n');

// const token = '6336765125:AAGduWrAO6jW5HAUS5cqSeg7R0RbfAJOU7M'; // test
const token = '251565029:AAErzJEJV-PY1TWxrenvFnEccrm4lt623_U'; // production
const options = {
  polling: true,
  baseApiUrl: 'https://tgrasp.co'
};

const bot = new TelegramBot(token, options);
const menuHandler = require('./menuHandler');
const support = require('./support');
const promotions = require('./promotions');
const { sendTariffSelection } = require('./tariffSelection');

const commands = [
  {
      command: "start",
      description: i18n.__('lang_select')
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
      command: "tariffs",
      description: i18n.__('tarrifs')
  },
  {
      command: "promotions",
      description: i18n.__('promotions')
  },
  {
      command: "about",
      description: i18n.__('about_us')
  },
  {
      command: "channel",
      description: i18n.__('channel')
  },
  {
      command: "unsubscribe",
      description: i18n.__('unsubscribe')
  }
];

try {
  bot.setMyCommands(commands);

  bot.onText(/\/(connect|support|channel|about|promotions|unsubscribe|tariffs)/, (msg, match) => {
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
        menuHandler.handleUnsubscribe(bot, msg);
        break;
      case 'tariffs':
        sendTariffSelection(bot, msg.chat.id);
        break;
      default:
        // Действие по умолчанию, если команда не распознана
        console.log(`Команда ${command} не распознана.`);
    }
  });
  
  bot.on("polling_error", console.log);
  
  process.on('unhandledRejection', (reason) => {
    console.error('причина:', reason.response.body);
    // здесь логика обработки
  });
  

  languageAndInit.initialize(bot);
} catch (e) {
  console.log("----------- ERROR -----------");
  console.error('An error occurred: ', e);
  console.log("----------- /ERROR -----------");
}
