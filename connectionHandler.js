let connectionRequests = {}; // Хранит запросы на подключение

function displayConnectionOptions(bot, msg) {
  const chatId = msg.chat.id;
  const options = {
      reply_markup: JSON.stringify({
          inline_keyboard: [
              [{ text: 'Юридическое лицо', callback_data: 'legal_entity' }],
              [{ text: 'Физическое лицо', callback_data: 'individual' }]
          ]
      })
  };
  bot.sendMessage(chatId, 'Выберите тип клиента:', options);
}

function requestLegalEntityInfo(bot, msg) {
  const chatId = msg.chat.id;
  connectionRequests[chatId] = { type: 'legal_entity' };
  bot.sendMessage(chatId, 'Введите название компании и номер телефона в ответном сообщении');
  console.log(connectionRequests + '1');
  connectionListener(bot)
}

function requestIndividualInfo(bot, msg) {
  const chatId = msg.chat.id;
  connectionRequests[chatId] = { type: 'individual' };
  bot.sendMessage(chatId, 'Введите ваш номер телефона в ответном сообщении');
  console.log(connectionRequests + '1');
  connectionListener(bot)
}

function connectionListener(bot) {
  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(connectionRequests + '2');
    // Проверка, есть ли активный запрос на подключение
    if (connectionRequests[chatId]) {
        // Логика обработки ввода пользователя
        handleConnectionRequestInput(bot, msg);

        // Удаление запроса после обработки
        delete connectionRequests[chatId];
    }
  });
}


function handleConnectionRequestInput(bot, answer, listenerId) {
  const chatId = answer.chat.id;
  const GROUP_CHAT_ID = '-1002070610990'; // ID группового чата администраторов
  const client = connectionRequests[chatId].type === 'individual' ? 'физ. лица' : 'юр. лица'
  console.log(client);
  // Пересылка сообщения в групповой чат
  bot.sendMessage(GROUP_CHAT_ID, `Запрос на подключение от ${client} @${answer.from.username}: "${answer.text}"`);

  // Удаление обработчика после получения ответа
  bot.removeTextListener(listenerId);

  // Отправка подтверждения пользователю с возможностью отмены
  bot.sendMessage(chatId, 'Ваш запрос был отправлен. Ожидайте ответа.');

}


module.exports = { displayConnectionOptions, requestLegalEntityInfo, requestIndividualInfo, handleConnectionRequestInput };
