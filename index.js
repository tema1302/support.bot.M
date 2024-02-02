const TelegramBot = require('node-telegram-bot-api');
const languageSelection = require('./languageSelection');

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
      description: "Заявка на подключение"
  },
  {
      command: "support",
      description: "Техническая поддержка"
  },
  {
      command: "channel",
      description: "Информация о телеграм-канале"
  },
  {
      command: "unsubscribe",
      description: "Отписаться от рассылки"
  }
];

bot.setMyCommands(commands);

// Обработка команды /connect
bot.onText(/\/connect/, (msg) => {
  connectionHandler.displayConnectionOptions(bot, msg);
});

// Обработка команды /support
bot.onText(/\/support/, (msg) => {
  supportHandler.handleSupportRequest(bot, msg);
});

// Обработка команды /channel
bot.onText(/\/channel/, (msg) => {
  menuHandler.handleChannelInfo(bot, msg);
});

// Обработка команды /unsubscribe
bot.onText(/\/unsubscribe/, (msg) => {
  console.log(menuHandler);
  menuHandler.handleUnsubscribe(bot, msg);
});

bot.on("polling_error", err => console.log(err.data.error.message));

languageSelection.initialize(bot);
