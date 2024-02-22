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
                // акции
            case 'back_to_promotions':
                promotions.displayPromotions(bot, chatId);
                break;
            case 'bring_a_friend':
            case 'promo_300':
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
        console.log('displayConnectionOptions');
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
    bot.sendMessage(chatId, 'Вы отписались от бота. Чтобы подписаться снова, отправьте команду /start.');
}
function displayAboutInfo(bot, msg) {
    const chatId = msg.chat.id;
    const options = {
        parse_mode: 'HTML',
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Назад', callback_data: 'menuHandler handleMenuAction back_to_menu' }]
            ]
        })
    };
    // Здесь должна быть логика для отписки пользователя от бота
    // Например, удаление пользователя из базы данных подписчиков
    bot.sendMessage(chatId, '<b>Кто мы</b>\n\n<b>Gals Telecom</b> подключает интернет в Ташкенте и кабельное телевидение с 2008 года. За это время выросли не только гигабиты скорости, но и возможности, которые мы предоставляем. Для частных клиентов — бесплатные цифровые ресурсы: доступ к музыке, кино, цифровому и IP-телевидению. Для корпоративных — индивидуальные тарифы под любые отрасли бизнеса, задачи и команды.\nМы поддерживаем высокую скорость и стабильное качество связи, чем бы вы не занимались.\n\n<b>Как мы это делаем</b>\n\nМы объединяем технологии и опыт, чтобы оперативно подключать новых клиентов и помогать тем, кто уже с нами. Мы отвечаем за качество интернета от монтажа и настройки оборудования до последующего сервиса и поддержки 24/7.\n<b>Наша миссия</b> — создавать условия для комфортной жизни и развития бизнеса за счёт внедрения цифровых технологий.\n\nМы ценим ваше время, поэтому всегда остаёмся на связи. Служба технической поддержки работает 24/7, в выходные и праздники. Позвоните, чтобы узнать больше о тарифах и бесплатных цифровых сервисах от интернет в Ташкенте <b>Gals Telecom</b>.', options);
}

function handleChannelInfo(bot, msg) {
    const options = {
        parse_mode: 'HTML',
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Назад', callback_data: 'menuHandler handleMenuAction back_to_menu' }]
            ]
        })
    };
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Посетите наш телеграм-канал: https://t.me/galstelecom', options);
}

module.exports = { handleMenuAction, handleUnsubscribe, handleChannelInfo, displayAboutInfo, displayConnectionOptions };
