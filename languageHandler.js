function displayLanguageOptions(bot, msg) {
    const chatId = msg.chat.id;
    const options = { // Опции для метода отправки сообщения
        reply_markup: JSON.stringify({ // JSON-строка для настройки клавиатуры
            inline_keyboard: [
                [{ text: 'o’zbek tili', callback_data: 'uzbek' }],
                [{ text: 'Русский', callback_data: 'russian' }]
            ]
        })
    };
    bot.sendMessage(chatId, 'Выберите язык:', options);
}

module.exports = { displayLanguageOptions };
