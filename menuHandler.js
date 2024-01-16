const supportHandler = require('./supportHandler');

function handleMenuAction(bot, action, msg) {
    switch (action) {
        case 'connect':
            displayConnectionOptions(bot, msg);
            break;
        case 'support':
            supportHandler.handleSupportRequest(bot, msg);
            break;
        case 'channel':
            handleChannelInfo(bot, msg);
            break;
        case 'unsubscribe':
            handleUnsubscribe(bot, msg);
            break;
        case 'ask_question':
            supportHandler.promptForQuestion(bot, msg);
            break;
        case 'cancel_question':
            supportHandler.handleCancelQuestion(bot, msg);
            break;
    }
}

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

function handleUnsubscribe(bot, msg) {
    const chatId = msg.chat.id;
    // Здесь должна быть логика для отписки пользователя от бота
    // Например, удаление пользователя из базы данных подписчиков
    bot.sendMessage(chatId, 'Вы отписались от бота. Чтобы подписаться снова, отправьте команду /start.');
}

function handleChannelInfo(bot, msg) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Посетите наш телеграм-канал: https://t.me/galstelecom');
}

module.exports = { handleMenuAction };
