const i18n = require('./config/i18n');
const backButton = () => {
  return {
      reply_markup: JSON.stringify({
          inline_keyboard: [
              [{ text: i18n.__('back_to_tariff'), callback_data: 'tariff handleTariffSelection back_to_tariffs' }]
          ]
      })
  };
};

const sendTariffSelection = (bot, chatId) => {
  try {
      bot.sendMessage(chatId, 'Выберите тариф:', {
          reply_markup: JSON.stringify({
              inline_keyboard: [
                  [{ text: i18n.__('tariff_vip_0'), callback_data: 'tariff handleTariffSelection vip_0' }],
                  [{ text: i18n.__('tariff_vip_1'), callback_data: 'tariff handleTariffSelection vip_1' }],
                  [{ text: i18n.__('tariff_vip_2'), callback_data: 'tariff handleTariffSelection vip_2' }],
                  [{ text: i18n.__('tariff_vip_3'), callback_data: 'tariff handleTariffSelection vip_3' }],
                  [{ text: i18n.__('tariff_vip_4'), callback_data: 'tariff handleTariffSelection vip_4' }],
                  [{ text: i18n.__('tariff_vip_5'), callback_data: 'tariff handleTariffSelection vip_5' }],
                  [{ text: i18n.__('tariff_vip_6'), callback_data: 'tariff handleTariffSelection vip_6' }],
                  [{ text: i18n.__('tariff_vip_8'), callback_data: 'tariff handleTariffSelection vip_8' }],
                  [{ text: i18n.__('tariff_gt_1'), callback_data: 'tariff handleTariffSelection gt_1' }],
                  [{ text: i18n.__('tariff_gt_2'), callback_data: 'tariff handleTariffSelection gt_2' }],
                  [{ text: i18n.__('tariff_gt_3'), callback_data: 'tariff handleTariffSelection gt_3' }],
              ]
          })
      });
  } catch (e) {
      console.log("----------- ERROR -----------");
      console.log(e);
      console.log("----------- /ERROR -----------");
  }
};

const handleTariffSelection = (bot, chatId, action, msg) => {
  let photo;
  let caption;

  switch(action) {
    case 'vip_0':
      photo = './assets/images/VIP0.jpg';
      caption = i18n.__('tariff_vip_0_caption');
      break;
    case 'vip_1':
      photo = './assets/images/VIP1.jpg';
      caption = i18n.__('tariff_vip_1_caption');
      break;
    case 'vip_2':
      photo = './assets/images/VIP2.jpg';
      caption = i18n.__('tariff_vip_2_caption');
      break;
    case 'vip_3':
      photo = './assets/images/VIP3.jpg';
      caption = i18n.__('tariff_vip_3_caption');
      break;
    case 'vip_4':
      photo = './assets/images/VIP4.jpg';
      caption = i18n.__('tariff_vip_4_caption');
      break;
    case 'vip_5':
      photo = './assets/images/VIP5.jpg';
      caption = i18n.__('tariff_vip_5_caption');
      break;
    case 'vip_6':
      photo = './assets/images/VIP6.jpg';
      caption = i18n.__('tariff_vip_6_caption');
      break;
    case 'vip_8':
      photo = './assets/images/VIP8.jpg';
      caption = i18n.__('tariff_vip_8_caption');
      break;
    case 'gt_1':
      photo = './assets/images/GT1.jpg';
      caption = i18n.__('tariff_gt_1_caption');
      break;
    case 'gt_2':
      photo = './assets/images/GT2.jpg';
      caption = i18n.__('tariff_gt_2_caption');
      break;
    case 'gt_3':
      photo = './assets/images/GT3.jpg';
      caption = i18n.__('tariff_gt_3_caption');
      break;
    case 'back_to_tariffs':
      sendTariffSelection(bot, chatId);
      return;
  }

  bot.sendPhoto(chatId, photo, { caption: caption, parse_mode: 'Markdown', ...backButton() });
};



module.exports = {
  sendTariffSelection,
  handleTariffSelection
};
