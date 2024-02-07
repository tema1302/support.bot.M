const i18n = require('./config/i18n');
const individual = require('./individual');

let connectionRequests = {}; // Хранит запросы на подключение

function displayConnectionOptions(bot, msgOrChatId) {
  // Определение chatId в зависимости от типа переданного аргумента - перегрузка
  const chatId = typeof msgOrChatId === 'object' ? msgOrChatId.chat.id : msgOrChatId;

  // const chatId = msg.chat.id;
  const options = {
      reply_markup: JSON.stringify({
          inline_keyboard: [
            // отрабатывает в menuHandler.js
              [{ text: i18n.__('legal_entity_option'), callback_data: 'legal_entity' }],
              [{ text: i18n.__('individual_option'), callback_data: 'individual' }],
              [{ text: i18n.__('back'), callback_data: 'back_to_menu' }],
          ]
      })
  };
  bot.sendMessage(chatId, i18n.__('choose_client_type'), options);
}

function requestLegalEntityInfo(bot, msg) {
  const chatId = msg.chat.id;
  connectionRequests[chatId] = { type: 'legal_entity' };
  bot.sendMessage(chatId, i18n.__('enter_company_info'));
  console.log(connectionRequests + '1');
  connectionListener(bot)
}

function requestIndividualInfo(bot, msg) {
  const chatId = msg.chat.id;
  connectionRequests[chatId] = { type: 'individual' };
  bot.sendMessage(chatId, i18n.__('enter_phone_number'));
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
  bot.sendMessage(GROUP_CHAT_ID, `${i18n.__('connection_request_from')} ${client} @${answer.from.username}: "${answer.text}"`);
  bot.removeTextListener(listenerId);

  // Отправка подтверждения пользователю с возможностью отмены
  bot.sendMessage(chatId, i18n.__('request_sent'));

}


module.exports = { displayConnectionOptions, requestLegalEntityInfo, requestIndividualInfo, handleConnectionRequestInput };
