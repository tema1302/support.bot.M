const supportHandler = require('./supportHandler');
const connectionHandler = require('./connectionHandler');
const menu = require('./menu');

function handleMenuAction(bot, action, msg) {
    switch (action) {
        case 'connect':
            connectionHandler.displayConnectionOptions(bot, msg);
            break;
        case 'support':
            supportHandler.handleSupportRequest(bot, msg);
            break;
        case 'channel':
            handleChannelInfo(bot, msg);
            break;
        case 'promotions':
            displayPromotions(bot, msg);
            break;
        case 'about_us':
            displayAboutInfo(bot, msg);
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
        case 'legal_entity':
            connectionHandler.requestLegalEntityInfo(bot, msg);
            break;
        case 'individual':
            connectionHandler.requestIndividualInfo(bot, msg);
            break;
        case 'back_to_menu':
            menu.displayMenu(bot, msg);
            break;
    }
}

function handleUnsubscribe(bot, msg) {
    const chatId = msg.chat.id;
    // Здесь должна быть логика для отписки пользователя от бота
    // Например, удаление пользователя из базы данных подписчиков
    bot.sendMessage(chatId, 'Вы отписались от бота. Чтобы подписаться снова, отправьте команду /start.');
}

function displayPromotions(bot, msg) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Инфа о акциях');
}

function displayAboutInfo(bot, msg) {
    const chatId = msg.chat.id;
    // Здесь должна быть логика для отписки пользователя от бота
    // Например, удаление пользователя из базы данных подписчиков
    bot.sendMessage(chatId, 'Инфа о нас.');
}

function handleChannelInfo(bot, msg) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Посетите наш телеграм-канал: https://t.me/galstelecom');
}

module.exports = { handleMenuAction, handleUnsubscribe, handleChannelInfo, displayPromotions, displayAboutInfo };
