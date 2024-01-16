const TelegramBot = require('node-telegram-bot-api');
const botController = require('./botController');

const token = '6336765125:AAGduWrAO6jW5HAUS5cqSeg7R0RbfAJOU7M'; // Замените на ваш токен
const bot = new TelegramBot(token, { polling: true });

const menuHandler = require('./menuHandler');
const supportHandler = require('./supportHandler');

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
  console.log('lalala');
  menuHandler.displayConnectionOptions(bot, msg);
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
  menuHandler.handleUnsubscribe(bot, msg);
});

bot.on("polling_error", err => console.log(err.data.error.message));

botController.initialize(bot);
