const menuHandler = require('./menuHandler');
const GROUP_CHAT_ID = '-4183932329'; // test
// const GROUP_CHAT_ID = '-1002070610990'; // ID группового чата администраторов

// Новые состояния для сценария подключения услуг юридических лиц
const Steps = {
  IDLE: 0,
  AWAITING_NAME: 1,
  AWAITING_PHONE: 2,
  AWAITING_ADDRESS: 3,
  MESSAGE_WAS_SENT: 4,
};

let userStates = {}; // Хранит состояние для каждого пользователя
let companyUserInfo = {}; // Глобальный объект для хранения информации о заявке юридического лица

// Функция для начала сценария подключения услуг юридического лица
function startLegalEntityConnectionScenario(bot, chatId) {
  try {
    console.log('startLegalEntityConnectionScenario');
    userStates[chatId] = Steps.IDLE;
    proceedToNextStep(bot, chatId);
    companyUserInfo[chatId] = {};
  } catch (e) {
    console.log("----------- ERROR -----------");
    console.log(e);
    console.log("----------- /ERROR -----------");
  }
}

// Обработка ввода пользователя для юридических лиц
function handleUserInput(bot, msg) {
  try {
    const chatId = msg.chat.id;
    if (!userStates[chatId]) return;

    const text = msg.text;
    switch (userStates[chatId]) {
      case Steps.AWAITING_NAME:
        updateUserInfo(chatId, 'name', text);
        proceedToNextStep(bot, chatId);
        break;
      case Steps.AWAITING_PHONE:
        updateUserInfo(chatId, 'phone', text);
        proceedToNextStep(bot, chatId);
        break;
      case Steps.AWAITING_ADDRESS:
        updateUserInfo(chatId, 'address', text);
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
              [{ text: 'Назад', callback_data: 'go_back_company' }]
          ]
      })
  };
}


// Обработка выбора услуги
function handleCallbackQuery(bot, callbackQuery) {
  try {
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;
    const data = callbackQuery.data;

    console.log(data);
    if (data === 'go_back_company') {
      console.log('loggg go_back_company');
      proceedToPreviousStep(bot, chatId);
    } else {
      switch (data) {
        // компании перенести в company.js
          case 'legal_entity':
            startLegalEntityConnectionScenario(bot, chatId);
            break;
          case 'region_yakkasaray':
          case 'region_mirabad':
          case 'region_sergeli':
          case 'region_yangihayot':
          case 'region_other':
              updateUserInfo(chatId, 'region', data.replace('region_', ''));
              proceedToNextStep(bot, chatId);
              break;
          case 'vip_0':
          case 'vip_1':
          case 'vip_2':
          case 'vip_3':
          case 'vip_4':
          case 'vip_5':
          case 'vip_6':
          case 'vip_8':
          case 'gt_1':
          case 'gt_2':
          case 'gt_3':
              updateUserInfo(chatId, 'tariff', data);
              proceedToNextStep(bot, chatId);
              break;
      }
    }
  } catch (e) {
    console.log("----------- ERROR -----------");
    console.log(e);
    console.log("----------- /ERROR -----------");
  }
}

function resetUserState(chatId) {
  try {
    userStates[chatId] = Steps.IDLE;
    delete companyUserInfo[chatId];
  } catch (e) {
    console.log("----------- ERROR -----------");
    console.log(e);
    console.log("----------- /ERROR -----------");
  }
}

// ++
function proceedToNextStep(bot, chatId) {
  try {
    if (userStates[chatId] < Steps.MESSAGE_WAS_SENT) {
      userStates[chatId]++;
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
    if (userStates[chatId] > Steps.IDLE) {
        clearFutureSteps(chatId, userStates[chatId]);
        userStates[chatId]--;
    } 
    proceedToStep(bot, chatId, userStates[chatId]);
  } catch (e) {
    console.log("----------- ERROR -----------");
    console.log(e);
    console.log("----------- /ERROR -----------");
  }
}

// Обработка шагов для юридических лиц
function proceedToStep(bot, chatId, step) {
  try {
    switch (step) {
      case Steps.IDLE:
          menuHandler.displayConnectionOptions(bot, chatId);
          break;
      case Steps.AWAITING_NAME:
        bot.sendMessage(chatId, 'Введите название вашей компании:', backButton());
        break;
      case Steps.AWAITING_PHONE:
        bot.sendMessage(chatId, 'Введите номер телефона компании:', backButton());
        break;
      case Steps.AWAITING_ADDRESS:
        bot.sendMessage(chatId, 'Введите адрес компании:', backButton());
        break;
      case Steps.MESSAGE_WAS_SENT:
        sendDataToAdmins(bot, chatId);
        bot.sendMessage(chatId, 'Ваша заявка была отправлена. Спасибо!');
        resetUserState(chatId); 
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
      delete companyUserInfo[chatId][stepKey.toLowerCase()];
  });
}

// Обновление информации пользователя
function updateUserInfo(chatId, field, value) {
  if (!companyUserInfo[chatId]) companyUserInfo[chatId] = {};
  companyUserInfo[chatId][field] = value;
}

// Отправка данных администраторам с учетом типа заявителя (юридическое лицо)
function sendDataToAdmins(bot, chatId) {
  const userInfo = companyUserInfo[chatId];
  let message = `*Новая заявка на подключение услуг Юр. лица:*\n`;
  for (const key in userInfo) {
    message += `${key}: ${userInfo[key]}\n`;
  }
  bot.sendMessage(GROUP_CHAT_ID, message);
}

module.exports = { handleUserInput, handleCallbackQuery, startLegalEntityConnectionScenario };
