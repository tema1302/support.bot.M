
const i18n = require('./config/i18n');
const languageHandler = require('./languageHandler');
const menuHandler = require('./menuHandler');
const support = require('./support');
const individual = require('./individual');
const menu = require('./menu');
const company = require('./company');
const promotions = require('./promotions');
const tariff = require('./tariffSelection');
const fetch = require('node-fetch');
const { logMessage } = require('./logger');


function initialize(bot) {
    bot.onText(/\/start/, async (msg) => {
        try {
            await languageHandler.displayLanguageOptions(bot, msg);
        } catch (e) {
            console.log("----------- ERROR -----------");
            console.log(e);
            console.log("----------- /ERROR -----------");
        }
    });


    
    bot.on('message', async (msg) => {
        try {
            const username = msg.from.username || msg.from.first_name || "Аноним";
            const text = msg.text;
            logMessage(username, `Получено сообщение: ${text}`);

            if (msg.text.startsWith('/')) {
                console.log('startWith');
                // если сообщение начинается с /, то завершаем все сценарии
                company.resetUserState(msg.chat.id);
                individual.resetUserState(msg.chat.id);
                // разобраться, что не так
                // support.clearFutureSteps(msg.chat.id, 1);
            } else {
                support.handleUserInput(bot, msg);
                individual.handleUserInput(bot, msg);
                company.handleUserInput(bot, msg);
            }
        } catch (e) {
                logMessage("SYSTEM", `Ошибка в обработчике сообщений: ${e.message}`);
                console.log("----------- ERROR -----------");
                console.log(e);
                console.log("----------- /ERROR -----------");
        }
    });
    
    const myModules = { tariff: tariff, promotions: promotions, company: company, individual: individual, support: support, menuHandler: menuHandler, languageHandler: languageHandler, menu: menu, i18n: i18n, fetch: fetch, logMessage: logMessage}

    bot.on('callback_query', (callbackQuery) => {
        try {
            // const action = callbackQuery.data;
            const msg = callbackQuery.message;
            const chatId = msg.chat.id;

            const username = callbackQuery.from.username || callbackQuery.from.first_name || "Аноним";
            
            const action = callbackQuery.data.split(' ')
            const moduleN = action[0];
            const methodN = action[1];
            const actionParam = action[2];
            console.log('ТЕКУЩАЯ КОМАНДА, callbackQuery.data ====== ', action);
            console.log('ТЕКУЩИЙ метод, methodN ====== ', myModules[moduleN][methodN]);
            myModules[moduleN][methodN](bot, chatId, actionParam, msg);

            console.log("----------- START CALLBACK QUERY -----------");
            logMessage(username, `Нажата inline-кнопка: ${action}`);

            // switch (action) {
            //     // языки
            //     default:
            //         console.log('defalut case');
            //         support.handleCallbackQuery(bot, callbackQuery);
            //         individual.handleCallbackQuery(bot, callbackQuery);
            //         company.handleCallbackQuery(bot, callbackQuery);
            //         menuHandler.handleMenuAction(bot, action, msg);
            //         tariff.handleTariffSelection(bot, chatId, action);
            //         break;
            // }
        } catch (e) {
            logMessage("SYSTEM", `Ошибка в обработчике сообщений: ${e.message}`);
            console.log("----------- ERROR -----------");
            console.log(e);
            console.log("----------- /ERROR -----------");
        }
    });
    
}

module.exports = { initialize };
