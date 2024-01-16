const TelegramBot = require('node-telegram-bot-api');
const botController = require('./botController');

const token = '6336765125:AAGduWrAO6jW5HAUS5cqSeg7R0RbfAJOU7M'; // Замените на ваш токен
const bot = new TelegramBot(token, { polling: true });

botController.initialize(bot);
