let userQuestionContext = {};
let userStates = {}; // Хранит состояние для каждого пользователя

const menu = require('./menu');

function handleSupportRequest(bot, msg) {
    const chatId = msg.chat.id;
    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: i18n.__('ask_question'), callback_data: 'ask_question' }]
            ]
        })
    };
    bot.sendMessage(chatId, i18n.__('click_button_below'), options);
}

function promptForQuestion(bot, msg) {
    const chatId = msg.chat.id;
    userStates[chatId] = 'AWAITING_QUESTION'; // Установка состояния ожидания вопроса

    bot.sendMessage(chatId, i18n.__('write_question_below'));

    // Установка обработчика для следующего текстового сообщения
    const listenerId = bot.on('message', (answer) => {
        if (answer.chat.id === chatId && answer.text && userStates[chatId] === 'AWAITING_QUESTION') {
            // Обработка вопроса пользователя
            handleUserQuestion(bot, answer, listenerId);
        }
    });
}

function handleUserQuestion(bot, answer, listenerId) {
    const chatId = answer.chat.id;
    const GROUP_CHAT_ID = '-1002070610990'; // ID группового чата администраторов

    userQuestionContext[chatId] = { username: answer.from.username }; // Сохранение контекста пользователя
    console.log(userQuestionContext);

    // Пересылка сообщения в групповой чат
    bot.sendMessage(GROUP_CHAT_ID, `❓ Вопрос от пользователя @${answer.from.username}: "${answer.text}"`);

    // Удаление обработчика после получения ответа
    bot.removeTextListener(listenerId);

    // Отправка подтверждения пользователю с возможностью отмены
    bot.sendMessage(chatId, i18n.__('request_sent'), {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: i18n.__('cancel_question'), callback_data: 'cancel_question' }]
            ]
        })
    });

    userStates[chatId] = 'IDLE'; // Сброс состояния пользователя
}

function handleCancelQuestion(bot, msg) {
    const chatId = msg.chat.id;
    const GROUP_CHAT_ID = '-1002070610990'; // ID группового чата администраторов
    const username = userQuestionContext[chatId]?.username || 'неизвестный пользователь';
    // Отправка сообщения об отмене вопроса в чат администраторов
    bot.sendMessage(GROUP_CHAT_ID, `Пользователь @${username} отменил запрос на вызов оператора.`);

    // Отправка подтверждения пользователю
    bot.sendMessage(chatId, i18n.__('question_canceled'));

    // Очистка контекста пользователя и сброс его состояния
    delete userQuestionContext[chatId];
    userStates[chatId] = 'IDLE';

    console.log(userQuestionContext);
    menu.displayMenu(bot, msg);
}

module.exports = { handleSupportRequest, promptForQuestion, handleCancelQuestion };
