const i18n = require('./config/i18n');
function displayLanguageOptions(bot, msg) {
    const chatId = msg.chat.id;
    const options = { 
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '🇺🇿 o’zbek tili', callback_data: 'menuHandler handleMenuAction uzbek' }],
                [{ text: '🇷🇺 Русский', callback_data: 'menuHandler handleMenuAction russian' }]
            ]
        })  
    };
    bot.sendMessage(chatId, i18n.__('choose_lang'), options);
}

module.exports = { displayLanguageOptions };
