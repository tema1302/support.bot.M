const menuHandler = require('./menuHandler');
const GROUP_CHAT_ID = '-4183932329'; // test
// const GROUP_CHAT_ID = '-4183415492'; // test test
// const GROUP_CHAT_ID = '-1002070610990'; // ID группового чата администраторов
const menu = require('./menu');
const i18n = require('./config/i18n');

const { logMessage } = require('./logger');

// Новые состояния для сценария подключения услуг юридических лиц
const Steps = {
  IDLE: 0,
  AWAITING_NAME: 1,
  AWAITING_PHONE: 2,
  AWAITING_ADDRESS: 3,
  MESSAGE_WAS_SENT: 4,
};

let userStates = {};
let companyUserInfo = {};

async function startLegalEntityConnectionScenario(bot, chatId) {
  try {
    console.log('startLegalEntityConnectionScenario');
    userStates[chatId] = Steps.IDLE;
    await proceedToNextStep(bot, chatId);
    companyUserInfo[chatId] = {};
  } catch (e) {
    console.log("----------- ERROR -----------");
    console.log(e);
    console.log("----------- /ERROR -----------");
  }
}

// Обработка ввода пользователя для юридических лиц
async function handleUserInput(bot, msg) {
  try {
    const chatId = msg.chat.id;
    if (!userStates[chatId]) return;

    const text = msg.text;
    logMessage('=== Юр лицо ===', text);

    switch (userStates[chatId]) {
      case Steps.AWAITING_NAME:
        updateUserInfo(chatId, 'name', text);
        await proceedToNextStep(bot, chatId);
        break;
      case Steps.AWAITING_PHONE:
        updateUserInfo(chatId, 'phone', text);
        await proceedToNextStep(bot, chatId);
        break;
      case Steps.AWAITING_ADDRESS:
        updateUserInfo(chatId, 'address', text);
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
              [{ text: i18n.__('back'), callback_data: 'company handleCallbackQuery go_back_company' }]
          ]
      })
  };
}

async function handleCallbackQuery(bot, chatId, action, msg) {
  try {
    console.log(action);
    if (action === 'go_back_company') {
      await proceedToPreviousStep(bot, chatId);
    } else {
      switch (action) {
          case 'legal_entity':
            startLegalEntityConnectionScenario(bot, chatId);
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
async function proceedToNextStep(bot, chatId) {
  try {
    if (userStates[chatId] < Steps.MESSAGE_WAS_SENT) {
      userStates[chatId]++;
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
    if (userStates[chatId] > Steps.IDLE) {
        clearFutureSteps(chatId, userStates[chatId]);
        userStates[chatId]--;
    } 
    await proceedToStep(bot, chatId, userStates[chatId]);
  } catch (e) {
    console.log("----------- ERROR -----------");
    console.log(e);
    console.log("----------- /ERROR -----------");
  }
}

async function proceedToStep(bot, chatId, step) {
  try {
    logMessage(`=== Юр.лицо === Шаг ${step}`);
    switch (step) {
      case Steps.IDLE:
          menuHandler.displayConnectionOptions(bot, chatId);
          break;
      case Steps.AWAITING_NAME:
        await bot.sendMessage(chatId, i18n.__('enter_company_name'), backButton());
        break;
      case Steps.AWAITING_PHONE:
        await bot.sendMessage(chatId, i18n.__('enter_company_phone'), backButton());
        break;
      case Steps.AWAITING_ADDRESS:
        await bot.sendMessage(chatId, i18n.__('enter_company_address'), backButton());
        break;
      case Steps.MESSAGE_WAS_SENT:
        await sendDataToAdmins(bot, chatId);
        await bot.sendMessage(chatId, i18n.__('thanks_wait')).then(() => {
          resetUserState(chatId);
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
      delete companyUserInfo[chatId][stepKey.toLowerCase()];
  });
}

const messageUserAndAdmins = (chatId) => {
  const user = companyUserInfo[chatId];    
  let message = `🏙 Новая заявка на подключение услуг Юр. лица:\n\n`;
  const fieldMapReverse = {
      'address': i18n.__('company_address'),
      'name': i18n.__('company_name'),
      'phone': i18n.__('phone'),
  };

  for (const key in user) {
      if (key === 'scenario') continue;
      const keyRussian = fieldMapReverse[key] || key;
      message += `▪️ ${keyRussian}: ${user[key]}\n`;
  }
  return message;
}

function updateUserInfo(chatId, field, value) {
  if (!companyUserInfo[chatId]) companyUserInfo[chatId] = {};
  companyUserInfo[chatId][field] = value;
}

async function sendDataToAdmins(bot, chatId) {
  const originalLocale = i18n.getLocale();
  try {
    i18n.setLocale('ru');
    const messageA = messageUserAndAdmins(chatId)
    const options = {
      parse_mode: 'HTML',
      reply_markup: JSON.stringify({
          inline_keyboard: [
              [{ text: "Открыть чат с пользователем", url: `tg://user?id=${chatId}` }]
          ]
      })
    };
    await bot.sendMessage(GROUP_CHAT_ID, messageA, options);

  } catch (e) {
    console.log("----------- ERROR -----------");
    console.log(e);
    console.log("----------- /ERROR -----------");
  } finally {
      i18n.setLocale(originalLocale);
  }
}

module.exports = { companyUserInfo, handleUserInput, resetUserState, handleCallbackQuery, startLegalEntityConnectionScenario };
