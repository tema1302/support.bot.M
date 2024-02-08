const supportHandler = require('./supportHandler');
// const connectionHandler = require('./connectionHandler');
const menu = require('./menu');
const i18n = require('./config/i18n');

function handleMenuAction(bot, action, msg) {
    try {
        switch (action) {
            case 'connect':
                console.log('connect');
                displayConnectionOptions(bot, msg);
                break;
            case 'support':
                supportHandler.startSupportScenario(bot, msg);
                console.log('support');
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
        }
    } catch (e) {
        console.log("----------- ERROR -----------");
        console.log(e);
        console.log("----------- /ERROR -----------");
    }
}


function displayConnectionOptions(bot, msgOrChatId) {
    try {
        console.log('displayConnectionOptions');
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
    } catch (e) {
        console.log("----------- ERROR -----------");
        console.log(e);
        console.log("----------- /ERROR -----------");
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

module.exports = { handleMenuAction, handleUnsubscribe, handleChannelInfo, displayPromotions, displayAboutInfo, displayConnectionOptions };
