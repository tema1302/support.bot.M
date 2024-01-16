const TelegramBot = require('node-telegram-bot-api');

function displayMenu(bot, msg) {
  const chatId = msg.chat.id;
  const options = {
      reply_markup: JSON.stringify({
          inline_keyboard: [
              [{ text: 'Заявка на подключение', callback_data: 'connect' }],
              [{ text: 'Тех. поддержка', callback_data: 'support' }],
              [{ text: 'Телеграм-канал', callback_data: 'channel' }],
              [{ text: 'Отписаться от бота', callback_data: 'unsubscribe' }]
          ]
      })
  };
  bot.sendMessage(chatId, 'Выберите опцию:', options);
}

module.exports = {
    displayMenu,
    // другие общие функции
};
