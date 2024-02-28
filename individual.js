const menuHandler = require('./menuHandler');
const GROUP_CHAT_ID = '-4183932329'; // test
// const GROUP_CHAT_ID = '-4183415492'; // test test
// const GROUP_CHAT_ID = '-1002070610990'; // ID группового чата администраторов
const i18n = require('./config/i18n');
const { logMessage } = require('./logger');

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

let userStates = {};
let individualUserInfo = {};

async function startConnectionScenario(bot, chatId) {
  try {
    userStates[chatId] = Steps.IDLE;
    individualUserInfo[chatId] = {};
    await proceedToNextStep(bot, chatId);
  } catch (e) {
    console.log("----------- ERROR -----------");
    console.log(e);
    console.log("----------- /ERROR -----------");
  }
}

async function handleUserInput(bot, msg) {
  const chatId = msg.chat.id;
  const text = msg.text;
  try {
    if (!userStates[chatId]) return;
    
    // Обновляем информацию пользователя в зависимости от текущего шага
    switch (userStates[chatId]) {
      case Steps.AWAITING_NAME:
          updateUserInfo(chatId, 'name', text);
          await proceedToNextStep(bot, chatId);
          break;
      case Steps.AWAITING_PHONE:
          updateUserInfo(chatId, 'phone', text);
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
    }
  } catch (e) {
    console.log("----------- ERROR -----------");
    console.log(e);
    console.log("----------- /ERROR -----------");
  }
}

async function handleCallbackQuery(bot, chatId, action, msg) {
  try {
    if (action === 'go_back') {
      await proceedToPreviousStep(bot, chatId);
    } else {
      switch (action) {
          case 'individual':
            await startConnectionScenario(bot, chatId);
            break;
          case 'internet':
          case 'cable-tv':
              updateUserInfo(chatId, 'service', action);
              await proceedToNextStep(bot, chatId);
              break;
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
              updateUserInfo(chatId, 'tariff', action);
              await proceedToNextStep(bot, chatId);
              break;
          case 'data_is_right':
              await proceedToNextStep(bot, chatId);
      }
    }
  } catch (e) {
    console.log("----------- ERROR -----------");
    console.log(e);
    console.log("----------- /ERROR -----------");
  }
}

async function sendTariffSelection(bot, chatId) {
  try {
    await bot.sendMessage(chatId, i18n.__('choose_tariff'), {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: i18n.__('tariff_vip_0'), callback_data: 'individual handleCallbackQuery vip_0' }],
            [{ text: i18n.__('tariff_vip_1'), callback_data: 'individual handleCallbackQuery vip_1' }],
            [{ text: i18n.__('tariff_vip_2'), callback_data: 'individual handleCallbackQuery vip_2' }],
            [{ text: i18n.__('tariff_vip_3'), callback_data: 'individual handleCallbackQuery vip_3' }],
            [{ text: i18n.__('tariff_vip_4'), callback_data: 'individual handleCallbackQuery vip_4' }],
            [{ text: i18n.__('tariff_vip_5'), callback_data: 'individual handleCallbackQuery vip_5' }],
            [{ text: i18n.__('tariff_vip_6'), callback_data: 'individual handleCallbackQuery vip_6' }],
            [{ text: i18n.__('tariff_vip_8'), callback_data: 'individual handleCallbackQuery vip_8' }],
            [{ text: i18n.__('tariff_gt_1'), callback_data: 'individual handleCallbackQuery gt_1' }],
            [{ text: i18n.__('tariff_gt_2'), callback_data: 'individual handleCallbackQuery gt_2' }],
            [{ text: i18n.__('tariff_gt_3'), callback_data: 'individual handleCallbackQuery gt_3' }],
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
    if (userStates[chatId] < Steps.MESSAGE_WAS_SENT) {
      if (userStates[chatId] === Steps.AWAITING_APARTMENT_NUMBER && individualUserInfo[chatId].service === 'cable-tv') {
        userStates[chatId] = Steps.CHECK_DATA;
      } else {
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

async function proceedToPreviousStep(bot, chatId) {
  try {
    if (userStates[chatId] > Steps.IDLE) {
        clearFutureSteps(chatId, userStates[chatId]);
        if (userStates[chatId] === Steps.CHECK_DATA && individualUserInfo[chatId].service === 'cable-tv') {
          userStates[chatId] = Steps.AWAITING_APARTMENT_NUMBER;
        } else {
          userStates[chatId]--;
        }
    } 
    await proceedToStep(bot, chatId, userStates[chatId]);
  } catch (e) {
    console.log("----------- ERROR -----------");
    console.log(e);
    console.log("----------- /ERROR -----------");
  }
}

const messageUserAndAdmins = (chatId, startMessage) => {
  const user = individualUserInfo[chatId];    
  let message = `${startMessage}:\n\n`;
  const fieldMapReverse = {
    'region': i18n.__('region'),
    'array_or_street': i18n.__('array_or_street'),
    'house_number': i18n.__('house_number'),
    'apartment_number': i18n.__('apartment_number'),
    'name': i18n.__('name'),
    'phone': i18n.__('phone'),
    'service': i18n.__('service'),
    'tariff': i18n.__('tariff'),
  };
  const serviceLocalization = {
    'internet': i18n.__('internet'),
    'cable-tv': i18n.__('cable-tv')
  };


  for (const key in user) {
      if (key === 'scenario') continue;
      const keyRussian = fieldMapReverse[key] || key;

      let value = user[key];
      if (key === 'service') {
        value = serviceLocalization[value] || value;
      }
      message += `▪️ ${keyRussian}: ${value}\n`;
  }
  return message;
}


async function proceedToStep(bot, chatId, step) {
  console.log('userStates[chatId]', userStates[chatId]);
  try {
    logMessage(`=== Физ.лицо === Шаг ${step}`);
    console.log('proceedToStep individual', step);
    switch (step) {
      case Steps.IDLE:
        menuHandler.displayConnectionOptions(bot, chatId);
        break;
      case Steps.AWAITING_NAME:
        bot.sendMessage(chatId, i18n.__('enter_your_name'), backButton());
        break;
      case Steps.AWAITING_SERVICE_SELECTION:
        bot.sendMessage(chatId, i18n.__('what_interests_you'), {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: i18n.__('internet'), callback_data: 'individual handleCallbackQuery internet' }],
            [{ text: i18n.__('cable-tv'), callback_data: 'individual handleCallbackQuery cable-tv' }],
            [{ text: i18n.__('back'), callback_data: 'individual handleCallbackQuery go_back' }]
          ]
        })
      });
        break;
      case Steps.AWAITING_PHONE:
        bot.sendMessage(chatId, i18n.__('enter_your_phone'), backButton());
        break;
      case Steps.AWAITING_REGION_SELECTION:
        sendRegionSelection(bot, chatId);
        break;
      case Steps.AWAITING_STREET:
        bot.sendMessage(chatId, i18n.__('enter_street_or_area'), backButton());
        break;
      case Steps.AWAITING_HOUSE_NUMBER:
        bot.sendMessage(chatId, i18n.__('enter_house_number'), backButton());
        break;
      case Steps.AWAITING_APARTMENT_NUMBER:
        bot.sendMessage(chatId, i18n.__('enter_apartment_number'), backButton());
        break;
      case Steps.AWAITING_TARIFF_SELECTION:
        sendTariffSelection(bot, chatId); 
        break;
      case Steps.CHECK_DATA:
        console.log('Steps.CHECK_DATA');
        const startMessage = i18n.__('check_your_data');
        
        const messageU = messageUserAndAdmins(chatId, startMessage);
        console.log(messageU)
        await bot.sendMessage(chatId, messageU, backButton_withAgree());
        break;
      case Steps.MESSAGE_WAS_SENT:
        await sendDataToAdmins(bot, chatId);
        bot.sendMessage(chatId, i18n.__('thanks_wait')).then(() => {
          resetUserState(chatId); 
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

function backButton() {
  return {
    reply_markup: JSON.stringify({
      inline_keyboard: [
      [{ text: i18n.__('back'), callback_data: 'individual handleCallbackQuery go_back' }],
      ]
    })
  };
}
function backButton_withAgree() {
  return {
      reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: i18n.__('agree_with_data'), callback_data: 'individual handleCallbackQuery data_is_right' }],
            [{ text: i18n.__('back'), callback_data: 'individual handleCallbackQuery go_back' }],
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


async function sendRegionSelection(bot, chatId) {
  try {
      await bot.sendMessage(chatId, i18n.__('choose_your_region'), {
          reply_markup: JSON.stringify({
              inline_keyboard: [
                [{ text: i18n.__('region_yakkasaray'), callback_data: 'individual handleCallbackQuery region_yakkasaray' }],
                [{ text: i18n.__('region_mirabad'), callback_data: 'individual handleCallbackQuery region_mirabad' }],
                [{ text: i18n.__('region_sergeli'), callback_data: 'individual handleCallbackQuery region_sergeli' }],
                [{ text: i18n.__('region_yangihayot'), callback_data: 'individual handleCallbackQuery region_yangihayot' }],
                [{ text: i18n.__('region_other'), callback_data: 'individual handleCallbackQuery region_other' }],
                [{ text: i18n.__('back'), callback_data: 'individual handleCallbackQuery go_back' }]
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

async function sendDataToAdmins(bot, chatId) {
  const originalLocale = i18n.getLocale();
    try {
      i18n.setLocale('ru');
      // await bot.sendMessage(GROUP_CHAT_ID, message, { parse_mode: 'Markdown' });
      const startMessage = '🧑🏻‍🦲Новая заявка на подключение услуг Физ. лица';
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

module.exports = { individualUserInfo, handleUserInput, resetUserState, handleCallbackQuery, startConnectionScenario };
