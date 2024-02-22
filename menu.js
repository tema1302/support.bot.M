const i18n = require('./config/i18n');

function displayMenu(bot, chatId) {
    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: i18n.__('connect'), callback_data: 'menuHandler handleMenuAction connect' }],
                [{ text: i18n.__('support'), callback_data: 'menuHandler handleMenuAction support' }],
                [{ text: i18n.__('tarrifs'), callback_data: 'menuHandler handleMenuAction tariffs' }],
                [{ text: i18n.__('promotions'), callback_data: 'menuHandler handleMenuAction promotions' }],
                [{ text: i18n.__('channel'), callback_data: 'menuHandler handleMenuAction channel' }],
                [{ text: i18n.__('about_us'), callback_data: 'menuHandler handleMenuAction about_us' }],
                [{ text: i18n.__('unsubscribe'), callback_data: 'menuHandler handleMenuAction unsubscribe' }],
            ]
        })
    };
    bot.sendMessage(chatId, i18n.__('choose_option'), options);
}

module.exports = {
    displayMenu,
};
