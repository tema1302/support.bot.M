let userQuestionContext = {};
const commonActions = require('./commonActions');

function handleSupportRequest(bot, msg) {
  const chatId = msg.chat.id;
  const options = {
      reply_markup: JSON.stringify({
          inline_keyboard: [
              [{ text: 'Задать вопрос', callback_data: 'ask_question' }]
          ]
      })
  };
  bot.sendMessage(chatId, 'Если хотите о чем-нибудь спросить, кликните на кнопку ниже', options);
}

function promptForQuestion(bot, msg) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Напишите свой вопрос под этим сообщением. Укажите номер телефона - оператор вам перезвонит');

  // Установка обработчика для следующего текстового сообщения
  const listenerId = bot.on('message', (answer) => {
      if (answer.chat.id === chatId && answer.text) {
          // Обработка вопроса пользователя
          handleUserQuestion(bot, answer, listenerId);
      }
  });
}

function handleUserQuestion(bot, answer, listenerId) {
  const chatId = answer.chat.id;
  const GROUP_CHAT_ID  = '-1002070610990'; // ID группового чата администраторов
  if (Object.keys(userQuestionContext).length === 0) {
    console.log('userQuestionContext пустой: ' + userQuestionContext);
    userQuestionContext[chatId] = { username: answer.from.username };
  }
  console.log(userQuestionContext);
  // Пересылка сообщения в групповой чат
  bot.sendMessage(GROUP_CHAT_ID, `Вопрос от пользователя @${answer.from.username}: "${answer.text}"`);

  // Удаление обработчика после получения ответа
  bot.removeTextListener(listenerId);

  // Отправка подтверждения пользователю с возможностью отмены
  bot.sendMessage(chatId, 'Ваш вопрос был отправлен. Ожидайте ответа.', {
      reply_markup: JSON.stringify({
          inline_keyboard: [
              [{ text: 'Отменяю вопрос - никого не зовите!', callback_data: 'cancel_question' }]
          ]
      })
  });
}


function handleCancelQuestion(bot, msg) {
  const chatId = msg.chat.id;
  const GROUP_CHAT_ID  = '-1002070610990'; // ID группового чата администраторов
  const username = userQuestionContext[chatId]?.username || 'неизвестный пользователь';

    // Отправка сообщения об отмене вопроса в чат администраторов
    bot.sendMessage(GROUP_CHAT_ID, `Пользователь @${username} отменил запрос на вызов оператора.`);

    // Отправка подтверждения пользователю
    bot.sendMessage(chatId, 'Ваш запрос был отменён.');
    userQuestionContext = {};
    console.log(userQuestionContext);
    commonActions.displayMenu(bot, msg);
}


module.exports = { handleSupportRequest, promptForQuestion, handleCancelQuestion };
