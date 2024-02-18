
const i18n = require('./config/i18n');
const languageHandler = require('./languageHandler');
const menuHandler = require('./menuHandler');
const support = require('./support');
const individual = require('./individual');
const menu = require('./menu');
const company = require('./company');
const promotions = require('./promotions');
const { logMessage } = require('./logger');
const { handleTariffSelection } = require('./tariffSelection');
const fetch = require('node-fetch');

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
        // try {
        //         const api_key = "65c8e816177eb:9cb0abd1ddc8a8f2dbcf78aa3cfcadc569f4dabb1084a25980910e97b35a4c60";
        //         const response = await fetch('https://api.graspil.com/api/send-update', {
        //         method: 'POST',
        //         headers: {
        //             "Api-Key": api_key,
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(msg),
        //         });
            
        //         if (!response.ok) {
        //         throw new Error(`Ошибка отправки данных в Graspil: ${response.statusText}`);
        //         }
            
        //         console.log('Данные успешно отправлены в Graspil');
        //         console.log(response);
        //     } catch (error) {
        //         console.error('Ошибка при отправке данных в Graspil:', error);
        //     }


            // const url = "https://api.graspil.com/api/send-update";
            // // const api_key = "65c8e816177eb:9cb0abd1ddc8a8f2dbcf78aa3cfcadc569f4dabb1084a25980910e97b35a4c60";  // your API key
            // const data = {
            //     "ok": true,
            //     "result": [
            //         {
            //         "update_id": 123,
            //         "message": { /* детали сообщения */ }
            //         }
            //     ]
            // };  // received data from telegram

            // const headers = {
            //     "Api-Key": api_key,
            //     "Content-Type": "application/json"
            // };
            
            // fetch(url, {
            //     method: "POST",
            //     headers: headers,
            //     body: JSON.stringify(data)
            // })
            // .then(response => response.json())
            // .then(data => {
            //     // Обработка ответа
            //     console.log(data);
            // });
    });
    



    
    bot.on('callback_query', (callbackQuery) => {
        try {
            const action = callbackQuery.data;
            const msg = callbackQuery.message;
            const chatId = msg.chat.id;

            const username = callbackQuery.from.username || callbackQuery.from.first_name || "Аноним";
            
            console.log("----------- START CALLBACK QUERY -----------");
            console.log('ТЕКУЩАЯ КОМАНДА, callbackQuery.data ====== ', action);
            logMessage(username, `Нажата inline-кнопка: ${action}`);

            switch (action) {
                // языки
                case 'russian': 
                    i18n.setLocale('ru');
                    menu.displayMenu(bot, chatId);
                    break;
                case 'uzbek':
                    i18n.setLocale('uz');
                    menu.displayMenu(bot, chatId);
                    break;
                    // акции
                case 'back_to_promotions':
                    promotions.displayPromotions(bot, chatId);
                    break;
                case 'bring_a_friend':
                case 'promo_300':
                case 'free_cable':
                    promotions.handlePromotionSelection(bot, callbackQuery);
                    break;
                case 'back_to_menu':
                    menu.displayMenu(bot, chatId);
                    break;
                default:
                    console.log('defalut case');
                    support.handleCallbackQuery(bot, callbackQuery);
                    individual.handleCallbackQuery(bot, callbackQuery);
                    company.handleCallbackQuery(bot, callbackQuery);
                    menuHandler.handleMenuAction(bot, action, msg);
                    handleTariffSelection(bot, chatId, action);
                    break;
            }
        } catch (e) {
            logMessage("SYSTEM", `Ошибка в обработчике сообщений: ${e.message}`);
            console.log("----------- ERROR -----------");
            console.log(e);
            console.log("----------- /ERROR -----------");
        }
    });
    
}

module.exports = { initialize };
