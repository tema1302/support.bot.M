let userStates = {}; // Хранит состояние для каждого пользователя
let userInfo = {}; // Глобальный объект для хранения информации о пользователе
const GROUP_CHAT_ID = '-4183932329'; // test
// const GROUP_CHAT_ID = '-1002070610990'; // ID группового чата администраторов

const i18n = require('./config/i18n');
const menu = require('./menu');

// Инициализация состояний. Во всех, кроме IDLE, бот ожидает ответа от пользователя
const Steps = {
    IDLE: 0,
    AWAITING_LOGIN: 1,
    AWAITING_REGION_SELECTION: 2,
    AWAITING_HOUSE_NUMBER: 3,
    AWAITING_APARTMENT_NUMBER: 4,
    AWAITING_NAME: 5,
    AWAITING_PHONE: 6,
    AWAITING_QUESTION: 7,
    MESSAGE_WAS_SENT: 8,
};

function startSupportScenario(bot, msg) {
    console.log('startSupportScenario');
    const chatId = msg.chat.id;
    userStates[chatId] = Steps.AWAITING_LOGIN; // Начальное состояние сценария поддержки
    userInfo[chatId] = {};

    console.log('userStates', userStates);
    // Динамическая регистрация обработчика текстовых сообщений для сценария поддержки
    console.log('регистрируем обработчик текстовых сообщений');
    bot.on('message', (msg) => {
        if (userStates[msg.chat.id] && userStates[msg.chat.id] !== Steps.IDLE) {
            handleUserInput(bot, msg);
        }
    });

    // Регистрация обработчика callback_query для сценария поддержки
    console.log('регистрируем обработчик callback_query');
    bot.on('callback_query', (callbackQuery) => {
        console.log('обработчик callback_query');
        console.log('userStates', userStates);
        const chatId = callbackQuery.message.chat.id;
        if (userStates[chatId]) {
            handleCallbackQuery(bot, callbackQuery);
        }
    });
    handleSupportRequest(bot, msg);
}


function handleSupportRequest(bot, msg) {
    const chatId = msg.chat.id;
    console.log('chatId', chatId);
    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                // [{ text: i18n.__('ask_question'), callback_data: 'ask_question' }], // Кнопка для задания вопроса -- поменять на "Введите логин"
                [{ text: 'Написать логин', callback_data: 'write_login' }],
                [{ text: i18n.__('forgot_login'), callback_data: 'forgot_login' }]
            ]
        })
    };
    console.log('options', options);
    bot.sendMessage(chatId, i18n.__('click_button_below_or_write_login'), options);
}


// обработка ввода пользователя в сценарии "поддержка"
function handleUserInput(bot, msg) {
    const chatId = msg.chat.id;
    if (!userStates[chatId] || userStates[chatId] === Steps.IDLE) return;

    const step = userStates[chatId];
    const text = msg.text;
    console.log('step', step);
    console.log('Steps', Steps);
    console.log('userInfo', userInfo);

    switch (userStates[chatId]) {
        case Steps.AWAITING_LOGIN:
            updateUserInfo(chatId, 'login', text);
            proceedToNextStep(bot, chatId);
            break;
            // 3-й шаг
        case Steps.AWAITING_HOUSE_NUMBER:
            updateUserInfo(chatId, 'houseNumber', text);
            proceedToNextStep(bot, chatId);
            break;
            // 4-й шаг
        case Steps.AWAITING_APARTMENT_NUMBER:
            updateUserInfo(chatId, 'apartmentNumber', text);
            proceedToNextStep(bot, chatId);
            break;
            // 5-й шаг
        case Steps.AWAITING_NAME:
            updateUserInfo(chatId, 'name', text);
            proceedToNextStep(bot, chatId);
            break;
            // 6-й шаг
        case Steps.AWAITING_PHONE:
            updateUserInfo(chatId, 'phone', text);
            proceedToNextStep(bot, chatId);
            break;
            // 7-й шаг
        case Steps.AWAITING_QUESTION:
            updateUserInfo(chatId, 'question', text);
            proceedToNextStep(bot, chatId);
            break;
    }
    
}

function backButton() {
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Назад', callback_data: 'go_back' }]
            ]
        })
    };
}

// отработка кнопок внутри сценария "поддержка"
function handleCallbackQuery(bot, callbackQuery) {
    // console.log('Проверка callbackQuery: ', callbackQuery);
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;
    const data = callbackQuery.data; // название кнопки, которую нажал пользователь
    // console.log('Steps in CallbackQuery', Steps);
    // Обработка кнопки "Назад"
    if (data === 'go_back') {
        // console.log('go_back');
        // console.log('data:' + data);
        proceedToPreviousStep(bot, chatId);
    } else {
        // Обработка других callback_data
        // console.log('NOT go_back');
        // console.log('отрабатываем', data);
        switch (data) {
            case 'region_yakkasaray':
                updateUserInfo(chatId, 'region', 'Яккасарайский район');
                break;
            case 'region_mirabad':
                updateUserInfo(chatId, 'region', 'Мирабадский район');
                break;
            case 'region_sergeli':
                updateUserInfo(chatId, 'region', 'Сергелийский район');
                break;
            case 'region_yangihayot':
                updateUserInfo(chatId, 'region', 'Янгиҳаётский район');
                console.log('userInfo[chatId]', userInfo[chatId]);
                break;
            case 'region_other':
                updateUserInfo(chatId, 'region', data.replace('region_', ''));
                break;
            case 'forgot_login':
                console.log('таки да, forgot_login');
                // sendRegionSelection(bot, chatId);
                break;
            case 'write_login':
                userStates[chatId] = Steps.AWAITING_LOGIN;
                bot.sendMessage(chatId, 'Пожалуйста, напишите ваш логин.');
                break;    
            // Добавьте другие случаи для обработки выбора пользователем
        }
        proceedToNextStep(bot, chatId);
        console.log('userStates in handleCallbackQuery', userStates);
    }
}

// 1-й шаг
function sendRegionSelection(bot, chatId) {
    bot.sendMessage(chatId, 'Выберите ваш район:', {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Яккасарайский район', callback_data: 'region_yakkasaray' }],
                [{ text: 'Мирабадский район', callback_data: 'region_mirabad' }],
                [{ text: 'Сергелийский район', callback_data: 'region_sergeli' }],
                [{ text: 'Янгиҳаётский район', callback_data: 'region_yangihayot' }],
                [{ text: 'Другой район', callback_data: 'region_other' }],
                [{ text: 'Назад', callback_data: 'go_back' }]
            ]
        })
    });
}



function proceedToNextStep(bot, chatId) {
    // console.log('proceedToNextStep', userStates[chatId]);
    if (userStates[chatId] < Steps.MESSAGE_WAS_SENT) {
        userStates[chatId]++;
    }
    proceedToStep(bot, chatId, userStates[chatId]);
}

function proceedToPreviousStep(bot, chatId) {
    if (userStates[chatId] > Steps.AWAITING_LOGIN) {
        clearFutureSteps(chatId, userStates[chatId]);
        userStates[chatId]--;
    }
    proceedToStep(bot, chatId, userStates[chatId]);
}
// Переход к следующему или предыдущему шагу
function proceedToStep(bot, chatId, step) {
    console.log('step', step);
    switch (step) {
        case Steps.AWAITING_LOGIN:
            bot.sendMessage(chatId, 'Пожалуйста, напишите ваш логин.', backButton());
            break;
        case Steps.AWAITING_REGION_SELECTION:
            sendRegionSelection(bot, chatId);
            break;
        case Steps.AWAITING_HOUSE_NUMBER:
            bot.sendMessage(chatId, 'Введите номер вашего дома.', backButton());
            break;
        case Steps.AWAITING_APARTMENT_NUMBER:
            bot.sendMessage(chatId, 'Теперь введите номер квартиры.', backButton());
            break;
        case Steps.AWAITING_NAME:
            bot.sendMessage(chatId, 'Как к вам обращаться? Введите ваше имя.', backButton());
            break;
        case Steps.AWAITING_PHONE:
            bot.sendMessage(chatId, 'Введите ваш контактный телефон.', backButton());
            break;
        case Steps.AWAITING_QUESTION:
            bot.sendMessage(chatId, 'Теперь можете ввести ваш вопрос.', backButton());
            break;
        case Steps.MESSAGE_WAS_SENT:
            sendDataToAdmins(bot, chatId); // Функция отправки данных администраторам
            bot.sendMessage(chatId, 'Ваш вопрос был отправлен.');
            userStates[chatId] = Steps.IDLE; // Возвращаем состояние в IDLE
            delete userInfo[chatId]; // Очищаем данные пользователя после обработки
            break;
    }
}


function clearFutureSteps(chatId, currentStep) {
    const stepKeys = Object.keys(Steps).filter(key => Steps[key] > currentStep);
    stepKeys.forEach(stepKey => {
        delete userInfo[chatId][stepKey.toLowerCase()];
    });
}

function updateUserInfo(chatId, field, value) {
    if (!userInfo[chatId]) userInfo[chatId] = {};
    userInfo[chatId][field] = value;
}

function sendDataToAdmins(bot, chatId) {
    const user = userInfo[chatId];
    console.log('sendDataToAdmins');
    console.log('sendDataToAdmins');
    
    let message = `Новый запрос поддержки от пользователя:\n`;
    for (const key in user) {
        message += `${key}: ${user[key]}\n`;
    }
    bot.sendMessage(GROUP_CHAT_ID, message);
}



// ----------------- старая логика -----------------
// function promptForQuestion(bot, msg) {
//     const chatId = msg.chat.id;
//     userStates[chatId] = 'AWAITING_LOGIN'; // Установка состояния ожидания вопроса

//     bot.sendMessage(chatId, i18n.__('write_question_below'));

//     // Установка обработчика для следующего текстового сообщения
//     const listenerId = bot.on('message', (answer) => {
//         if (answer.chat.id === chatId && answer.text && userStates[chatId] === 'AWAITING_LOGIN') {
//             // Обработка вопроса пользователя
//             handleUserQuestion(bot, answer, listenerId);
//         }
//     });
// }

// function handleUserQuestion(bot, answer, listenerId) {
//     const chatId = answer.chat.id;
//     const GROUP_CHAT_ID = '-1002070610990'; // ID группового чата администраторов

//     userQuestionContext[chatId] = { username: answer.from.username }; // Сохранение контекста пользователя
//     console.log(userQuestionContext);

//     // Пересылка сообщения в групповой чат
//     bot.sendMessage(GROUP_CHAT_ID, `❓ Вопрос от пользователя @${answer.from.username}: "${answer.text}"`);

//     // Удаление обработчика после получения ответа
//     bot.removeTextListener(listenerId);

//     // Отправка подтверждения пользователю с возможностью отмены
//     bot.sendMessage(chatId, i18n.__('request_sent'), {
//         reply_markup: JSON.stringify({
//             inline_keyboard: [
//                 [{ text: i18n.__('cancel_question'), callback_data: 'cancel_question' }]
//             ]
//         })
//     });

//     userStates[chatId] = 'IDLE'; // Айдл - Бездействие системы, состояние покоя
// }

// function handleCancelQuestion(bot, msg) {
//     const chatId = msg.chat.id;
//     // const GROUP_CHAT_ID = '-1002070610990'; // ID группового чата администраторов прод
    
//     const username = userQuestionContext[chatId]?.username || 'неизвестный пользователь';
//     // Отправка сообщения об отмене вопроса в чат администраторов
//     bot.sendMessage(GROUP_CHAT_ID, `Пользователь @${username} отменил запрос на вызов оператора.`);

//     // Отправка подтверждения пользователю
//     bot.sendMessage(chatId, i18n.__('question_canceled'));

//     // Очистка контекста пользователя и сброс его состояния
//     delete userQuestionContext[chatId];
//     userStates[chatId] = 'IDLE';

//     console.log(userQuestionContext);
//     menu.displayMenu(bot, msg);
// }
// ---------------------- конец старой логики ----------------------

module.exports = {
    startSupportScenario,
    handleUserInput,
    handleCallbackQuery
};

// колбеки имеют следующую структуру:
// callbackQuery:  {
//     id: '2211121317835411129',
//     from: {
//       id: 514816799,
//       is_bot: false,
//       first_name: 'Temi4',
//       last_name: 'Facts',
//       username: 'artpan1302',
//       language_code: 'ru',
//       is_premium: true
//     },
//     message: {
//       message_id: 583,
//       from: {
//         id: 6336765125,
//         is_bot: true,
//         first_name: 'Gals Telecom Support',
//         username: 'GalsSupport_bot'
//       },
//       chat: {
//         id: 514816799,
//         first_name: 'Temi4',
//         last_name: 'Facts',
//         username: 'artpan1302',
//         type: 'private'
//       },
//       date: 1707160679,
//       text: '🔑 Если вы помните ваш логин, напишите его сейчас. Если нет, нажмите кнопку "Я не помню логин".',
//       reply_markup: { inline_keyboard: [Array] }
//     },
//     chat_instance: '3042827091277785429',
//     data: 'forgot_login'
//   }
