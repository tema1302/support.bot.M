const menuHandler = require('./menuHandler');

// Новые состояния для сценария подключения услуг
const Steps = {
  IDLE: 0,
  AWAITING_SERVICE_SELECTION: 1,
  AWAITING_NAME: 2,
  AWAITING_PHONE: 3,
  AWAITING_REGION_SELECTION: 4,
  AWAITING_STREET: 5,
  AWAITING_HOUSE_NUMBER: 6,
  AWAITING_APARTMENT_NUMBER: 7,
  AWAITING_TARIFF_SELECTION: 8,
  MESSAGE_WAS_SENT: 9,
};

let userStates = {}; // Хранит состояние для каждого пользователя
let individualUserInfo = {}; // Глобальный объект для хранения информации о заявке физического лица

// Функция для начала сценария подключения услуг
function startConnectionScenario(bot, chatId) {
  userStates[chatId] = Steps.AWAITING_SERVICE_SELECTION;
  individualUserInfo[chatId] = {};

  bot.sendMessage(chatId, 'Что вас интересует?', {
      reply_markup: JSON.stringify({
          inline_keyboard: [
              [{ text: 'Интернет', callback_data: 'internet' }],
              [{ text: 'Кабельное ТВ', callback_data: 'cable_tv' }],
              [{ text: 'Назад', callback_data: 'go_back_individual' }]
          ]
      })
  });
}

// Обработка ввода пользователя
function handleUserInput(bot, msg) {
  const chatId = msg.chat.id;
  if (!userStates[chatId] || userStates[chatId] === Steps.IDLE) return;

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
    case Steps.AWAITING_STREET:
        updateUserInfo(chatId, 'street', text);
        proceedToNextStep(bot, chatId);
        break;
    case Steps.AWAITING_HOUSE_NUMBER:
        updateUserInfo(chatId, 'houseNumber', text);
        proceedToNextStep(bot, chatId);
        break;
    case Steps.AWAITING_APARTMENT_NUMBER:
        updateUserInfo(chatId, 'apartmentNumber', text);
        proceedToNextStep(bot, chatId);
        break;
  }
}

// Обработка выбора услуги
function handleCallbackQuery(bot, callbackQuery) {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const data = callbackQuery.data;

  console.log(data);
  if (data === 'go_back_individual') {
    console.log('loggg go_back_individual');
    proceedToPreviousStep(bot, chatId);
  } else {
    switch (data) {
      // компании перенести в company.js
        case 'legal_entity':
          menuHandler.requestLegalEntityInfo(bot, msg);
          break;
        case 'individual':
          console.log('individual');
          startConnectionScenario(bot, chatId);
          break;
        case 'internet':
        case 'cable_tv':
            updateUserInfo(chatId, 'service', data);
            userStates[chatId] = Steps.AWAITING_NAME;
            bot.sendMessage(chatId, 'Введите ваше имя.', backButton());
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
            updateUserInfo(chatId, 'tariff', data);
            proceedToNextStep(bot, chatId);
            break;

    }
  }
}

// Добавляем функцию для отправки кнопок выбора тарифа
function sendTariffSelection(bot, chatId) {
  bot.sendMessage(chatId, 'Выберите тариф:', {
      reply_markup: JSON.stringify({
          inline_keyboard: [
              [{ text: 'VIP 0 - 60 000 сум', callback_data: 'vip_0' }],
              [{ text: 'VIP 1 - 85 000 сум', callback_data: 'vip_1' }],
              [{ text: 'Назад', callback_data: 'go_back_individual' }]
          ]
      })
  });
}


// ++
function proceedToNextStep(bot, chatId) {
  if (userStates[chatId] < Steps.MESSAGE_WAS_SENT) {
      userStates[chatId]++;
  }
  proceedToStep(bot, chatId, userStates[chatId]);
}

// --
function proceedToPreviousStep(bot, chatId) {
  console.log('proceedToPreviousStep', userStates[chatId]);
    if (userStates[chatId] > Steps.IDLE) {
        clearFutureSteps(chatId, userStates[chatId]);
        userStates[chatId]--;
        console.log(userStates[chatId]);
    }
  proceedToStep(bot, chatId, userStates[chatId]);
}

function proceedToStep(bot, chatId, step) {
  // Расширяем логику перехода к следующему шагу
  console.log('proceedToStep', step);
  switch (step) {
      case Steps.IDLE:
          menuHandler.displayConnectionOptions(bot, chatId);
          break;
      case Steps.AWAITING_SERVICE_SELECTION:
          startConnectionScenario(bot, chatId)
          // Предлагаем пользователю выбрать услугу
          bot.sendMessage(chatId, 'Выберите услугу:', {
              reply_markup: JSON.stringify({
                  inline_keyboard: [
                      [{ text: 'Интернет', callback_data: 'internet' }],
                      [{ text: 'Кабельное ТВ', callback_data: 'cable_tv' }],
                      [{ text: 'Назад', callback_data: 'go_back' }]
                  ]
              })
          });
          break;
      case Steps.AWAITING_PHONE:
          bot.sendMessage(chatId, 'Введите ваш контактный телефон.', backButton());
          break;
      case Steps.AWAITING_REGION_SELECTION:
          sendRegionSelection(bot, chatId); // Используйте уже существующую функцию для выбора района
          break;
      case Steps.AWAITING_STREET:
          bot.sendMessage(chatId, 'Введите название улицы.', backButton());
          break;
      case Steps.AWAITING_HOUSE_NUMBER:
          bot.sendMessage(chatId, 'Введите номер дома.', backButton());
          break;
      case Steps.AWAITING_APARTMENT_NUMBER:
          bot.sendMessage(chatId, 'Введите номер квартиры.', backButton());
          break;
      case Steps.AWAITING_TARIFF_SELECTION:
          sendTariffSelection(bot, chatId); // Функция для выбора тарифа
          break;
      case Steps.MESSAGE_WAS_SENT:
          sendDataToAdmins(bot, chatId); // Функция отправки данных администраторам
          bot.sendMessage(chatId, 'Ваша заявка была отправлена. Спасибо!');
          resetUserState(chatId); // Сброс состояния и информации пользователя
          break;
      default:
          break;
  }
}

// Функция для создания кнопки "Назад"
function backButton() {
  return {
      reply_markup: JSON.stringify({
          inline_keyboard: [
              [{ text: 'Назад', callback_data: 'go_back_individual' }]
          ]
      })
  };
}

function resetUserState(chatId) {
  userStates[chatId] = Steps.IDLE;
  delete individualUserInfo[chatId];
}

function clearFutureSteps(chatId, currentStep) {
  const stepKeys = Object.keys(Steps).filter(key => Steps[key] > currentStep);
  stepKeys.forEach(stepKey => {
      delete individualUserInfo[chatId][stepKey.toLowerCase()];
  });
}


// Обновление информации пользователя
function updateUserInfo(chatId, field, value) {
  if (!individualUserInfo[chatId]) individualUserInfo[chatId] = {};
  individualUserInfo[chatId][field] = value;
}

// Отправка данных администраторам
function sendDataToAdmins(bot, chatId) {
  const user = individualUserInfo[chatId];
  let message = `Новая заявка на подключение услуг:\n`;
  for (const key in user) {
      message += `${key}: ${user[key]}\n`;
  }
  bot.sendMessage(GROUP_CHAT_ID, message);
}

module.exports = { handleUserInput, handleCallbackQuery, startConnectionScenario };
