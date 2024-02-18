const i18n = require('./config/i18n');

function displayMenu(bot, chatId) {
    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: i18n.__('connect'), callback_data: 'connect' }],
                [{ text: i18n.__('promotions'), callback_data: 'promotions' }],
                [{ text: i18n.__('about_us'), callback_data: 'about_us' }],
                [{ text: i18n.__('support'), callback_data: 'support' }],
                [{ text: i18n.__('channel'), callback_data: 'channel' }],
                [{ text: i18n.__('unsubscribe'), callback_data: 'unsubscribe' }],
                [{ text: 'Тарифы', callback_data: 'tariffs' }],
            ]
        })
    };
    bot.sendMessage(chatId, i18n.__('choose_option'), options);
}

module.exports = {
    displayMenu,
};
