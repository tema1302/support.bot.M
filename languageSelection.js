const i18n = require('./config/i18n');
const languageHandler = require('./languageHandler');
const menuHandler = require('./menuHandler');
const supportHandler = require('./supportHandler');
const menu = require('./menu');

function initialize(bot) {
    bot.onText(/\/start/, (msg) => {
        languageHandler.displayLanguageOptions(bot, msg);
    });

    bot.on('callback_query', (callbackQuery) => {
        const action = callbackQuery.data;
        const msg = callbackQuery.message;
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
                menuHandler.handleMenuAction(bot, action, msg);
        }
    });
}

module.exports = { initialize };
