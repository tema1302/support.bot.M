let userStates = {}; // Хранит состояние для каждого пользователя
let suppUserInfo = {}; // Глобальный объект для хранения информации о пользователе
// const GROUP_CHAT_ID = '-4183932329'; // test
const GROUP_CHAT_ID = '-4183415492'; // test test
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
    try {
        const chatId = msg.chat.id;
        userStates[chatId] = Steps.IDLE;

        suppUserInfo[chatId] = {};
        
        handleSupportRequest(bot, chatId);
    } catch (e) {
        console.log("----------- ERROR -----------");
        console.log(e);
        console.log("----------- /ERROR -----------");
    }
}


function handleSupportRequest(bot, chatId) {
    try {
        console.log('chatId', chatId);
        console.log('userStates[chatId]', userStates[chatId]);
        const options = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: '✍️ Написать логин', callback_data: 'write_login' }],
                    [{ text: i18n.__('forgot_login'), callback_data: 'forgot_login' }],
                    [{ text: 'Назад в меню', callback_data: 'back_to_menu' }],
                ]
            })
        };
        bot.sendMessage(chatId, i18n.__('click_button_below_or_write_login'), options);
    } catch (e) {
        console.log("----------- ERROR -----------");
        console.log(e);
        console.log("----------- /ERROR -----------");
    }
}


// обработка ввода пользователя в сценарии "поддержка"
function handleUserInput(bot, msg) {
    try {
        const chatId = msg.chat.id;
        if (!userStates[chatId] || userStates[chatId] === Steps.IDLE) return;

        const step = userStates[chatId];
        const text = msg.text;
        // выяснить, почему отображается после ввода квартиры, а не дома
        console.log('step 1111111', step);

        switch (userStates[chatId]) {
            case Steps.AWAITING_LOGIN:
                updateUserInfo(chatId, 'login', text);
                // userStates[chatId] = Steps.AWAITING_QUESTION
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
    } catch (e) {
        console.log("----------- ERROR -----------");
        console.log(e);
        console.log("----------- /ERROR -----------");
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
    try {
        // console.log('Проверка callbackQuery: ', callbackQuery);
        const msg = callbackQuery.message;
        const chatId = msg.chat.id;
        const data = callbackQuery.data; // название кнопки, которую нажал пользователь
        // Обработка кнопки "Назад"
        if (data === 'go_back') {
            proceedToPreviousStep(bot, chatId);
        } else {
            // Обработка других callback_data
            switch (data) {
                case 'supp_region_yakkasaray':
                    updateUserInfo(chatId, 'region', 'Яккасарайский район');
                    proceedToNextStep(bot, chatId);
                    break;
                case 'supp_region_mirabad':
                    updateUserInfo(chatId, 'region', 'Мирабадский район');
                    proceedToNextStep(bot, chatId);
                    break;
                case 'supp_region_sergeli':
                    updateUserInfo(chatId, 'region', 'Сергелийский район');
                    proceedToNextStep(bot, chatId);
                    break;
                case 'supp_region_yangihayot':
                    updateUserInfo(chatId, 'region', 'Янгиҳаётский район');
                    console.log('suppUserInfo[chatId]', suppUserInfo[chatId]);
                    proceedToNextStep(bot, chatId);
                    break;
                case 'supp_region_other':
                    updateUserInfo(chatId, 'region', 'Другой район');
                    proceedToNextStep(bot, chatId);
                    break;
                case 'forgot_login':
                    suppUserInfo[chatId] = { scenario: 'forgot_login' };
                    proceedToNextStep(bot, chatId);
                    break;
                case 'write_login':
                    suppUserInfo[chatId] = { scenario: 'write_login' };
                    proceedToNextStep(bot, chatId);
                    // bot.sendMessage(chatId, 'Пожалуйста, напишите ваш логин.');
                    break;    
                // Добавьте другие случаи для обработки выбора пользователем
            }
            
            // console.log('userStates in handleCallbackQuery', userStates);
        }
    } catch (e) {
        console.log("----------- ERROR -----------");
        console.log(e);
        console.log("----------- /ERROR -----------");
    }
}

// 1-й шаг
function sendRegionSelection(bot, chatId) {
    try {
        bot.sendMessage(chatId, 'Выберите ваш район:', {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: 'Яккасарайский район', callback_data: 'supp_region_yakkasaray' }],
                    [{ text: 'Мирабадский район', callback_data: 'supp_region_mirabad' }],
                    [{ text: 'Сергелийский район', callback_data: 'supp_region_sergeli' }],
                    [{ text: 'Янгиҳаётский район', callback_data: 'supp_region_yangihayot' }],
                    [{ text: 'Другой район', callback_data: 'supp_region_other' }],
                    [{ text: 'Назад', callback_data: 'go_back' }]
                ]
            })
        });
    } catch (e) {
        console.log("----------- ERROR -----------");
        console.log(e);
        console.log("----------- /ERROR -----------");
    }
}


// ++
function proceedToNextStep(bot, chatId) {
    try {
        const scenario = suppUserInfo[chatId].scenario;

        if (scenario === 'write_login' && userStates[chatId] === Steps.AWAITING_LOGIN) {
            console.log('write', userStates[chatId]);
            userStates[chatId] = Steps.AWAITING_QUESTION;
        } else if (scenario === 'forgot_login' && userStates[chatId] === Steps.IDLE) {
            console.log('forgot', userStates[chatId]);
            userStates[chatId] = Steps.AWAITING_REGION_SELECTION;
        } else {
            console.log('++', userStates[chatId]);
            if (userStates[chatId] < Steps.MESSAGE_WAS_SENT) {
                userStates[chatId]++;
            }
        }
        proceedToStep(bot, chatId, userStates[chatId]);
    } catch (e) {
        console.log("----------- ERROR -----------");
        console.log(e);
        console.log("----------- /ERROR -----------");
    }
}

// --
function proceedToPreviousStep(bot, chatId) {
    try {
        const scenario = suppUserInfo[chatId].scenario;

        if (scenario === 'write_login' && userStates[chatId] === Steps.AWAITING_QUESTION) {
            userStates[chatId] = Steps.AWAITING_LOGIN;
        } else if (scenario === 'forgot_login' && userStates[chatId] === Steps.AWAITING_REGION_SELECTION) {
            console.log('forgot', userStates[chatId]);
            userStates[chatId] = Steps.IDLE;
        } else {
            console.log('--', userStates[chatId]);
            if (userStates[chatId] > Steps.IDLE) {
                clearFutureSteps(chatId, userStates[chatId]);
                userStates[chatId]--;
            }
        }
        proceedToStep(bot, chatId, userStates[chatId]);
    } catch (e) {
        console.log("----------- ERROR -----------");
        console.log(e);
        console.log("----------- /ERROR -----------");
    }
}

// Переход к следующему или предыдущему шагу
function proceedToStep(bot, chatId, step) {
    try {
        console.log('step =========', step);
        console.log('userStates =========', suppUserInfo[chatId]);
        // const scenario = suppUserInfo[chatId].scenario;

        // if (scenario === 'forgot_login' && step === Steps.AWAITING_LOGIN) {
        //     // Пропускаем шаг AWAITING_LOGIN для сценария 'forgot_login'
        //     step++; // Переход к следующему шагу
        // }

        switch (step) {
            case Steps.IDLE:
                handleSupportRequest(bot, chatId);
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
            case Steps.AWAITING_LOGIN:
                bot.sendMessage(chatId, 'Пожалуйста, напишите ваш логин.', backButton());
                break;
            case Steps.AWAITING_QUESTION:
                bot.sendMessage(chatId, 'Теперь можете ввести ваш вопрос.', backButton());
                break;
            case Steps.MESSAGE_WAS_SENT:
                sendDataToAdmins(bot, chatId); // Функция отправки данных администраторам
                bot.sendMessage(chatId, 'Ваш вопрос был отправлен.').then(() => {
                    userStates[chatId] = Steps.IDLE; // Возвращаем состояние в IDLE
                    console.log('userStates', userStates);
                    delete suppUserInfo[chatId]; // Очищаем данные пользователя после обработки
                    menu.displayMenu(bot, chatId);
                });
                break;
        }
    } catch (e) {
        console.log("----------- ERROR -----------");
        console.log(e);
        console.log("----------- /ERROR -----------");
    }
}


function clearFutureSteps(chatId, currentStep) {
    const stepKeys = Object.keys(Steps).filter(key => Steps[key] > currentStep);
    stepKeys.forEach(stepKey => {
        delete suppUserInfo[chatId][stepKey.toLowerCase()];
    });
}

function updateUserInfo(chatId, field, value) {
    if (!suppUserInfo[chatId]) suppUserInfo[chatId] = {};
    suppUserInfo[chatId][field] = value;
}

function sendDataToAdmins(bot, chatId) {
    try {
        const user = suppUserInfo[chatId];    
        let message = `Новый запрос поддержки от пользователя:\n`;
        for (const key in user) {
            message += `${key}: ${user[key]}\n`;
        }
        bot.sendMessage(GROUP_CHAT_ID, message);
    } catch (e) {
        console.log("----------- ERROR -----------");
        console.log(e);
        console.log("----------- /ERROR -----------");
    }
}

module.exports = {
    Steps,
    userStates,
    suppUserInfo,
    startSupportScenario,
    handleUserInput,
    handleCallbackQuery,
    clearFutureSteps
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
