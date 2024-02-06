const i18n = require('./config/i18n');
const languageHandler = require('./languageHandler');
const menuHandler = require('./menuHandler');
const supportHandler = require('./supportHandler');
const menu = require('./menu');

function initialize(bot) {
    bot.onText(/\/start/, (msg) => {
        languageHandler.displayLanguageOptions(bot, msg);
    });

    // Регистрация обработчика текстовых сообщений для сценария поддержки
    bot.on('message', (msg) => {
            supportHandler.handleUserInput(bot, msg);
    });

    bot.on('callback_query', (callbackQuery) => {
        const action = callbackQuery.data;
        const msg = callbackQuery.message;
        const chatId = msg.chat.id;

        switch (action) {
            case 'russian': 
                i18n.setLocale('ru');
                menu.displayMenu(bot, msg);
                break;
            case 'uzbek':
                i18n.setLocale('uz');
                menu.displayMenu(bot, msg);
                break;
            // обработка других действий callbackQuery
            default:
                console.log('support');
                supportHandler.handleCallbackQuery(bot, callbackQuery);
                menuHandler.handleMenuAction(bot, action, msg);
                break;
        }
    });
}

module.exports = { initialize };
