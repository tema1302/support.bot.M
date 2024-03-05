let userStates = {}; // Хранит состояние для каждого пользователя
let suppUserInfo = {}; // Глобальный объект для хранения информации о пользователе
const GROUP_CHAT_ID = '-4183932329'; // test
// const GROUP_CHAT_ID = '-4183415492'; // test test
// const GROUP_CHAT_ID = '-1002070610990'; // ID группового чата администраторов
const { logMessage } = require('./logger');
const i18n = require('./config/i18n');

// Инициализация состояний. Во всех, кроме IDLE, бот ожидает ответа от пользователя
const Steps = {
    IDLE: 0,
    AWAITING_LOGIN: 1,
    AWAITING_REGION_SELECTION: 2,
    AWAITING_STREET: 3,
    AWAITING_HOUSE_NUMBER: 4,
    AWAITING_APARTMENT_NUMBER: 5,
    AWAITING_NAME: 6,
    AWAITING_PHONE: 7,
    AWAITING_QUESTION: 8,
    CHECK_DATA: 9,
    MESSAGE_WAS_SENT: 10,
};


async function startSupportScenario(bot, msg) {
    try {
        const chatId = msg.chat.id;
        userStates[chatId] = Steps.IDLE;

        suppUserInfo[chatId] = {};
        
        await handleSupportRequest(bot, chatId);
    } catch (e) {
        console.log("----------- ERROR -----------");
        console.log(e);
        console.log("----------- /ERROR -----------");
    }
}


async function handleSupportRequest(bot, chatId) {
    try {
        console.log('chatId', chatId);
        console.log('userStates[chatId]', userStates[chatId]);
        const options = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: i18n.__('write_login'), callback_data: 'support handleCallbackQuery write_login' }],
                    [{ text: i18n.__('forgot_login'), callback_data: 'support handleCallbackQuery forgot_login' }],
                    [{ text: i18n.__('back_menu'), callback_data: 'menuHandler handleMenuAction back_to_menu' }],
                ]
            })
        };
        await bot.sendMessage(chatId, i18n.__('support'), options);
    } catch (e) {
        console.log("----------- ERROR -----------");
        console.log(e);
        console.log("----------- /ERROR -----------");
    }
}


// обработка ввода пользователя в сценарии "поддержка"
async function handleUserInput(bot, msg) {
    try {
        const chatId = msg.chat.id;
        if (!userStates[chatId] || userStates[chatId] === Steps.IDLE) return;

        const step = userStates[chatId];
        const text = msg.text;
        // выяснить, почему отображается после ввода квартиры, а не дома
        console.log('step 1111111', step);
        logMessage('=== Поддержка ===', text);

        switch (userStates[chatId]) {
            case Steps.AWAITING_LOGIN:
                updateUserInfo(chatId, 'login', text);
                // userStates[chatId] = Steps.AWAITING_QUESTION
                await proceedToNextStep(bot, chatId);
                break;
            case Steps.AWAITING_STREET:
                updateUserInfo(chatId, 'array_or_street', text);
                await proceedToNextStep(bot, chatId);
                break;
            case Steps.AWAITING_HOUSE_NUMBER:
                updateUserInfo(chatId, 'house_number', text);
                await proceedToNextStep(bot, chatId);
                break;
            case Steps.AWAITING_APARTMENT_NUMBER:
                updateUserInfo(chatId, 'apartment_number', text);
                await proceedToNextStep(bot, chatId);
                break;
            case Steps.AWAITING_NAME:
                updateUserInfo(chatId, 'name', text);
                await proceedToNextStep(bot, chatId);
                break;
            case Steps.AWAITING_PHONE:
                updateUserInfo(chatId, 'phone', text);
                await proceedToNextStep(bot, chatId);
                break;
            case Steps.AWAITING_QUESTION:
                updateUserInfo(chatId, 'question', text);
                await proceedToNextStep(bot, chatId);
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
                [{ text: i18n.__('back'), callback_data: 'support handleCallbackQuery go_back' }]
            ]
        })
    };
}
function backButton_withAgree() {
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: i18n.__('agree_with_data'), callback_data: 'support handleCallbackQuery data_is_right_supp' }],
                [{ text: i18n.__('back'), callback_data: 'support handleCallbackQuery go_back' }],
            ]
        })
    };
}

// отработка кнопок внутри сценария "поддержка"
async function handleCallbackQuery(bot, chatId, action, msg) {
    try {
        // Обработка кнопки "Назад"
        if (action === 'go_back') {
            await proceedToPreviousStep(bot, chatId);
        } else {
            switch (action) {
                case 'region_yakkasaray':
                    updateUserInfo(chatId, 'region', i18n.__('region_yakkasaray'));
                    await proceedToNextStep(bot, chatId);
                    break;
                case 'region_mirabad':
                    updateUserInfo(chatId, 'region', i18n.__('region_mirabad'));
                    await proceedToNextStep(bot, chatId);
                    break;
                case 'region_sergeli':
                    updateUserInfo(chatId, 'region', i18n.__('region_sergeli'));
                    await proceedToNextStep(bot, chatId);
                    break;
                case 'region_yangihayot':
                    updateUserInfo(chatId, 'region', i18n.__('region_yangihayot'));
                    await proceedToNextStep(bot, chatId);
                    break;
                case 'region_other':
                    updateUserInfo(chatId, 'region', i18n.__('region_other'));
                    await proceedToNextStep(bot, chatId);
                    break;
                case 'forgot_login':
                    suppUserInfo[chatId] = { scenario: 'forgot_login' };
                    await proceedToNextStep(bot, chatId);
                    break;
                case 'write_login':
                    suppUserInfo[chatId] = { scenario: 'write_login' };
                    await proceedToNextStep(bot, chatId);
                    // await bot.sendMessage(chatId, 'Пожалуйста, напишите ваш логин.');
                    break;    
                case 'data_is_right_supp':
                    await proceedToNextStep(bot, chatId);          
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
async function sendRegionSelection(bot, chatId) {
    try {
        await bot.sendMessage(chatId, i18n.__('choose_your_region'), {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: i18n.__('region_yakkasaray'), callback_data: 'support handleCallbackQuery region_yakkasaray' }],
                    [{ text: i18n.__('region_mirabad'), callback_data: 'support handleCallbackQuery region_mirabad' }],
                    [{ text: i18n.__('region_sergeli'), callback_data: 'support handleCallbackQuery region_sergeli' }],
                    [{ text: i18n.__('region_yangihayot'), callback_data: 'support handleCallbackQuery region_yangihayot' }],
                    [{ text: i18n.__('region_other'), callback_data: 'support handleCallbackQuery region_other' }],
                    [{ text: i18n.__('back'), callback_data: 'support handleCallbackQuery go_back' }]
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
async function proceedToNextStep(bot, chatId) {
    try {
        const scenario = suppUserInfo[chatId].scenario; 

        if (scenario === 'write_login' && userStates[chatId] === Steps.AWAITING_LOGIN) {
            console.log('write', userStates[chatId]);
            userStates[chatId] = Steps.AWAITING_QUESTION;
        } else if (scenario === 'forgot_login' && userStates[chatId] === Steps.IDLE) {
            console.log('forgot', userStates[chatId]);
            userStates[chatId] = Steps.AWAITING_REGION_SELECTION;
        } else {
            console.log('+1 к текущему шагу', userStates[chatId]);
            if (userStates[chatId] < Steps.MESSAGE_WAS_SENT) {
                userStates[chatId]++;
            }
        }
        await proceedToStep(bot, chatId, userStates[chatId]);
    } catch (e) {
        console.log("----------- ERROR -----------");
        console.log(e);
        console.log("----------- /ERROR -----------");
    }
}

// --
async function proceedToPreviousStep(bot, chatId) {
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
        await proceedToStep(bot, chatId , userStates[chatId]);
    } catch (e) {
        console.log("----------- ERROR -----------");
        console.log(e);
        console.log("----------- /ERROR -----------");
    }
}


const messageUserAndAdmins = (chatId, startMessage) => {
    const user = suppUserInfo[chatId];    
    let message = `${startMessage}:\n\n`;
    const fieldMapReverse = {
        'login': i18n.__('login'),
        'region': i18n.__('region'),
        'array_or_street': i18n.__('array_or_street'),
        'house_number': i18n.__('house_number'),
        'apartment_number': i18n.__('apartment_number'),
        'name': i18n.__('name'),
        'phone': i18n.__('phone'),
        'question': i18n.__('question'),
    };

    for (const key in user) {
        if (key === 'scenario') continue;
        const keyRussian = fieldMapReverse[key] || key;
        message += `▪️ ${keyRussian}: ${user[key]}\n`;
    }
    return message;
}

async function proceedToStep(bot, chatId, step) {
    try {
        logMessage(`=== Поддержка === Шаг ${step}`);
        console.log('step =========', step);
        console.log('userStates =========', suppUserInfo[chatId]);
        // const scenario = suppUserInfo[chatId].scenario;

        // if (scenario === 'forgot_login' && step === Steps.AWAITING_LOGIN) {
        //     // Пропускаем шаг AWAITING_LOGIN для сценария 'forgot_login'
        //     step++; // Переход к следующему шагу
        // }

        switch (step) {
            case Steps.IDLE:
                await handleSupportRequest(bot, chatId);
                break;
            case Steps.AWAITING_REGION_SELECTION:
                await sendRegionSelection(bot, chatId);
                break;
            case Steps.AWAITING_STREET:
                await bot.sendMessage(chatId, i18n.__('enter_street_or_area'), backButton());
                break;
            case Steps.AWAITING_HOUSE_NUMBER:
                await bot.sendMessage(chatId, i18n.__('enter_house_number'), backButton());
                break;
            case Steps.AWAITING_APARTMENT_NUMBER:
                await bot.sendMessage(chatId, i18n.__('enter_apartment_number'), backButton());
                break;
            case Steps.AWAITING_NAME:
                await bot.sendMessage(chatId, i18n.__('how_to_address_you'), backButton());
                break;
            case Steps.AWAITING_PHONE:
                await bot.sendMessage(chatId, i18n.__('enter_your_phone'), backButton());
                break;
            case Steps.AWAITING_LOGIN:
                await bot.sendMessage(chatId, i18n.__('enter_your_login'), backButton());
                break;
            case Steps.AWAITING_QUESTION:
                await bot.sendMessage(chatId, i18n.__('write_your_question'), backButton());
                break;
            case Steps.CHECK_DATA:    
            const startMessage = i18n.__('check_your_data');
            const messageU = messageUserAndAdmins(chatId, startMessage);
                bot.sendMessage(chatId, messageU, backButton_withAgree());
                break;
        
            case Steps.MESSAGE_WAS_SENT:
                await sendDataToAdmins(bot, chatId);
                await bot.sendMessage(chatId, i18n.__('thanks_wait')).then(() => {
                    userStates[chatId] = Steps.IDLE;
                    console.log('userStates', userStates);
                    delete suppUserInfo[chatId];
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

async function sendDataToAdmins(bot, chatId) {
    const originalLocale = i18n.getLocale();
    try {
        i18n.setLocale('ru');
        const startMessage = '🆘Новый запрос поддержки от пользователя';
        const messageA = messageUserAndAdmins(chatId, startMessage);
        await bot.sendMessage(GROUP_CHAT_ID, messageA);
    } catch (e) {
        console.log("----------- ERROR -----------");
        console.log(e);
        console.log("----------- /ERROR -----------");
    } finally {
        i18n.setLocale(originalLocale);
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
