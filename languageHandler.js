function displayLanguageOptions(bot, msg) {
    const chatId = msg.chat.id;
    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Узбекский', callback_data: 'uzbek' }],
                [{ text: 'Русский', callback_data: 'russian' }]
            ]
        })
    };
    bot.sendMessage(chatId, 'Выберите язык:', options);
}

module.exports = { displayLanguageOptions };
