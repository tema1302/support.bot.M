const support = require('./support');
const menu = require('./menu');
const i18n = require('./config/i18n');
const promotions = require('./promotions');
const { sendTariffSelection } = require('./tariffSelection');

function handleMenuAction(bot, chatId, action, msg) {
    try {
        switch (action) {
            case 'connect':
                console.log('connect');
                displayConnectionOptions(bot, msg);
                break;
            case 'support':
                support.startSupportScenario(bot, msg);
                console.log('support');
                break;
            case 'channel':
                handleChannelInfo(bot, msg);
                break;
            case 'promotions':
                promotions.displayPromotions(bot, chatId);
                break;
            case 'about_us':
                displayAboutInfo(bot, msg);
                break;
            case 'unsubscribe':
                handleUnsubscribe(bot, msg);
                break;
            case 'tariffs':
                sendTariffSelection(bot, chatId);
                break;
            case 'russian':
                console.log('russian');
                i18n.setLocale('ru');
                menu.displayMenu(bot, chatId);
                break;
            case 'uzbek':
                i18n.setLocale('uz');
                menu.displayMenu(bot, chatId);
                break;
            case 'back_to_promotions':
                promotions.displayPromotions(bot, chatId);
                break;
            case 'bring_a_friend':
            case 'promo_300':
            case 'wi_fi_internet':
            case 'free_cable':
                promotions.handlePromotionSelection(bot, chatId, action);
                break;
            case 'back_to_menu':
                menu.displayMenu(bot, chatId);
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
        // Определение chatId в зависимости от типа переданного аргумента - перегрузка
        const chatId = typeof msgOrChatId === 'object' ? msgOrChatId.chat.id : msgOrChatId;

        // const chatId = msg.chat.id;
        const options = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    // отрабатывает в menuHandler.js
                    [{ text: i18n.__('legal_entity_option'), callback_data: 'company handleCallbackQuery legal_entity' }],
                    [{ text: i18n.__('individual_option'), callback_data: 'individual handleCallbackQuery individual' }],
                    [{ text: i18n.__('back'), callback_data: 'menuHandler handleMenuAction back_to_menu' }],
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
    bot.sendMessage(chatId, i18n.__('unsubscribe_success'));
}
function displayAboutInfo(bot, msg) {
    const chatId = msg.chat.id;
    const options = {
        parse_mode: 'HTML',
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: i18n.__('back'), callback_data: 'menuHandler handleMenuAction back_to_menu' }]
            ]
        })
    };
    bot.sendMessage(chatId, i18n.__('who_are_we'), options);
}

function handleChannelInfo(bot, msg) {
    const options = {
        parse_mode: 'HTML',
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: i18n.__('back'), callback_data: 'menuHandler handleMenuAction back_to_menu' }]
            ]
        })
    };
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, i18n.__('visit_channel'), options);
}

module.exports = { handleMenuAction, handleUnsubscribe, handleChannelInfo, displayAboutInfo, displayConnectionOptions };
