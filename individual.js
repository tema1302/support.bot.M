const menuHandler = require('./menuHandler');
// const GROUP_CHAT_ID = '-4183932329'; // test
const GROUP_CHAT_ID = '-4183415492'; // test test
// const GROUP_CHAT_ID = '-1002070610990'; // ID группового чата администраторов
const menu = require('./menu');

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
  CHECK_DATA: 9,
  MESSAGE_WAS_SENT: 10,
};

let userStates = {}; // Хранит состояние для каждого пользователя
let individualUserInfo = {}; // Глобальный объект для хранения информации о заявке физического лица

// Функция для начала сценария подключения услуг
function startConnectionScenario(bot, chatId) {
  try {
    userStates[chatId] = Steps.IDLE;
    individualUserInfo[chatId] = {};
    proceedToNextStep(bot, chatId);
    
  } catch (e) {
    console.log("----------- ERROR -----------");
    console.log(e);
    console.log("----------- /ERROR -----------");
  }
}

// Обработка ввода пользователя
function handleUserInput(bot, msg) {
  try {
    const chatId = msg.chat.id;
    if (!userStates[chatId] || userStates[chatId] === Steps.AWAITING_SERVICE_SELECTION) return;

    const text = msg.text;
    switch (userStates[chatId]) {
      case Steps.AWAITING_NAME:
          updateUserInfo(chatId, 'имя', text);
          proceedToNextStep(bot, chatId);
          break;
      case Steps.AWAITING_PHONE:
          updateUserInfo(chatId, 'телефон', text);
          proceedToNextStep(bot, chatId);
          break;
      case Steps.AWAITING_STREET:
          updateUserInfo(chatId, 'массив или улица', text);
          proceedToNextStep(bot, chatId);
          break;
      case Steps.AWAITING_HOUSE_NUMBER:
          updateUserInfo(chatId, 'номер дома', text);
          proceedToNextStep(bot, chatId);
          break;
      case Steps.AWAITING_APARTMENT_NUMBER:
          updateUserInfo(chatId, 'номер квартиры', text);
          proceedToNextStep(bot, chatId);
          break;
    }
  } catch (e) {
    console.log("----------- ERROR -----------");
    console.log(e);
    console.log("----------- /ERROR -----------");
  }
}

// Обработка выбора услуги
function handleCallbackQuery(bot, callbackQuery) {
  try {
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;
    const data = callbackQuery.data;

    console.log(data);
    if (data === 'go_back_individual') {
      proceedToPreviousStep(bot, chatId);
    } else {
      switch (data) {
          case 'individual':
            startConnectionScenario(bot, chatId);
            break;
          case 'internet':
          case 'cable-tv':
              updateUserInfo(chatId, 'услуга', data);
              proceedToNextStep(bot, chatId);
              break;
          case 'ind_region_yakkasaray':
          case 'ind_region_mirabad':
          case 'ind_region_sergeli':
          case 'ind_region_yangihayot':
          case 'ind_region_other':
              updateUserInfo(chatId, 'район', data.replace('ind_region_', ''));
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
              updateUserInfo(chatId, 'тариф', data);
              proceedToNextStep(bot, chatId);
              break;
          case 'data_is_right':
              proceedToNextStep(bot, chatId);
      }
    }
  } catch (e) {
    console.log("----------- ERROR -----------");
    console.log(e);
    console.log("----------- /ERROR -----------");
  }
}

// Добавляем функцию для отправки кнопок выбора тарифа
function sendTariffSelection(bot, chatId) {
  try {
    bot.sendMessage(chatId, 'Выберите тариф:', {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: 'VIP 0 — 🌇20 и 🌃3 Мбит/с, 60т сум', callback_data: 'vip_0' }],
            [{ text: 'VIP 1 — 🌇100 и 🌃7 Мбит/с, 85т сум', callback_data: 'vip_1' }],
            [{ text: 'VIP 2 — 🌇100 и 🌃15 Мбит/с, 95т сум', callback_data: 'vip_2' }],
            [{ text: 'VIP 3 — 🌇100 и 🌃20 Мбит/с, 110т сум', callback_data: 'vip_3' }],
            [{ text: 'VIP 4 — 🌇100 и 🌃50 Мбит/с, 140т сум', callback_data: 'vip_4' }],
            [{ text: 'VIP 5 — 🌇100 и 🌃60 Мбит/с, 165т сум', callback_data: 'vip_5' }],
            [{ text: 'VIP 6 — 🌇100 и 🌃75 Мбит/с, 180т сум', callback_data: 'vip_6' }],
            [{ text: 'VIP 8 — 🌇100 и 🌃100 Мбит/с, 230т сум', callback_data: 'vip_8' }],
            [{ text: 'GT 1 — 🌇200 и 🌃50 Мбит/с, 165т сум', callback_data: 'gt_1' }],
            [{ text: 'GT 2 — 🌇200 и 🌃75 Мбит/с, 250т сум', callback_data: 'gt_2' }],
            [{ text: 'GT 3 — 🌇200 и 🌃100 Мбит/с, 300т сум', callback_data: 'gt_3' }],
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
        console.log(userStates[chatId]);
    } 
    proceedToStep(bot, chatId, userStates[chatId]);
  } catch (e) {
    console.log("----------- ERROR -----------");
    console.log(e);
    console.log("----------- /ERROR -----------");
  }
}

function proceedToStep(bot, chatId, step) {
  try {
    // Расширяем логику перехода к следующему шагу
    console.log('proceedToStep individual', step);
    switch (step) {
        case Steps.IDLE:
            menuHandler.displayConnectionOptions(bot, chatId);
            break;
        case Steps.AWAITING_NAME:
            bot.sendMessage(chatId, 'Введите ваше имя.', backButton());
            break;
        case Steps.AWAITING_SERVICE_SELECTION:
          bot.sendMessage(chatId, 'Что вас интересует?', {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: 'Интернет', callback_data: 'internet' }],
                    [{ text: 'Кабельное ТВ', callback_data: 'cable-tv' }],
                    [{ text: 'Назад', callback_data: 'go_back_individual' }]
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
            bot.sendMessage(chatId, 'Напишите ваш район или улицу. Например: Сергели-1', backButton());
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
        case Steps.CHECK_DATA:
            const user = individualUserInfo[chatId];
            let message = `Проверьте ваши данные:\n\n`;
            for (const key in user) {
                message += `▪️ ${key} — ${user[key]}\n`;
            }

            bot.sendMessage(chatId, message, backButton_withAgree());
            break;
          case Steps.MESSAGE_WAS_SENT:
            sendDataToAdmins(bot, chatId); // Функция отправки данных администраторам
            bot.sendMessage(chatId, 'Ваша заявка была отправлена. Спасибо!').then(() => {
              resetUserState(chatId); // Сброс состояния и информации пользователя
              menu.displayMenu(bot, chatId);
            });
            break;
        default:
            break;
    }
  } catch (e) {
    console.log("----------- ERROR -----------");
    console.log(e);
    console.log("----------- /ERROR -----------");
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
function backButton_withAgree() {
  return {
      reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: 'Данные верны', callback_data: 'data_is_right' }],
            [{ text: 'Назад', callback_data: 'go_back_individual' }],
          ]
      })
  };
}


function resetUserState(chatId) {
  try {
    userStates[chatId] = Steps.IDLE;
    delete individualUserInfo[chatId];
  } catch (e) {
    console.log("----------- ERROR -----------");
    console.log(e);
    console.log("----------- /ERROR -----------");
  }
}

function clearFutureSteps(chatId, currentStep) {
  const stepKeys = Object.keys(Steps).filter(key => Steps[key] > currentStep);
  stepKeys.forEach(stepKey => {
      delete individualUserInfo[chatId][stepKey.toLowerCase()];
  });
}

// 1-й шаг
function sendRegionSelection(bot, chatId) {
  try {
      bot.sendMessage(chatId, 'Выберите ваш район:', {
          reply_markup: JSON.stringify({
              inline_keyboard: [
                  [{ text: 'Яккасарайский район', callback_data: 'ind_region_yakkasaray' }],
                  [{ text: 'Мирабадский район', callback_data: 'ind_region_mirabad' }],
                  [{ text: 'Сергелийский район', callback_data: 'ind_region_sergeli' }],
                  [{ text: 'Янгиҳаётский район', callback_data: 'ind_region_yangihayot' }],
                  [{ text: 'Другой район', callback_data: 'ind_region_other' }],
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


// Обновление информации пользователя
function updateUserInfo(chatId, field, value) {
  if (!individualUserInfo[chatId]) individualUserInfo[chatId] = {};
  individualUserInfo[chatId][field] = value;
}

// Отправка данных администраторам
function sendDataToAdmins(bot, chatId) {
  const user = individualUserInfo[chatId];
  let message = `👨🏻‍🦲Новая заявка на подключение услуг Физ. лица:\n\n`;
  for (const key in user) {
      message += `▪️ ${key} — ${user[key]}\n`;
  }
  // bot.sendMessage(GROUP_CHAT_ID, message, { parse_mode: 'Markdown' });
  bot.sendMessage(GROUP_CHAT_ID, message);
}

module.exports = { individualUserInfo, handleUserInput, resetUserState, handleCallbackQuery, startConnectionScenario };
