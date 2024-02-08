
const i18n = require('./config/i18n');
const languageHandler = require('./languageHandler');
const menuHandler = require('./menuHandler');
const supportHandler = require('./supportHandler');
const individual = require('./individual');
const menu = require('./menu');
const company = require('./company');

function initialize(bot) {
    try {
        bot.onText(/\/start/, (msg) => {
            languageHandler.displayLanguageOptions(bot, msg);
        });

        // Регистрация обработчика текстовых сообщений для сценария поддержки
        bot.on('message', (msg) => {
            supportHandler.handleUserInput(bot, msg);
            individual.handleUserInput(bot, msg);
            company.handleUserInput(bot, msg);
        });

        bot.on('callback_query', (callbackQuery) => {
            const action = callbackQuery.data;
            const msg = callbackQuery.message;

            console.log(callbackQuery);

            switch (action) {
                case 'russian': 
                    i18n.setLocale('ru');
                    menu.displayMenu(bot, msg);
                    break;
                case 'uzbek':
                    i18n.setLocale('uz');
                    menu.displayMenu(bot, msg);
                    break;
                default:
                    console.log('defalut case');
                    supportHandler.handleCallbackQuery(bot, callbackQuery);
                    individual.handleCallbackQuery(bot, callbackQuery);
                    company.handleCallbackQuery(bot, callbackQuery);
                    menuHandler.handleMenuAction(bot, action, msg);
                    break;
            }
        });
    } catch (e) {
        console.log("----------- ERROR -----------");
        console.log(e);
        console.log("----------- /ERROR -----------");
    }
}

module.exports = { initialize };
