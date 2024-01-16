const languageHandler = require('./languageHandler');
const menuHandler = require('./menuHandler');

function initialize(bot) {
    bot.onText(/\/start/, (msg) => {
        languageHandler.displayLanguageOptions(bot, msg);
    });

    bot.on('callback_query', (callbackQuery) => {
        const action = callbackQuery.data;
        const msg = callbackQuery.message;

        if (action === 'russian') {
            menuHandler.displayMenu(bot, msg);
        } else {
            menuHandler.handleMenuAction(bot, action, msg);
        }
    });
}

module.exports = { initialize };
