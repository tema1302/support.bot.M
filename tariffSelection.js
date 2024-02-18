const backButton = () => {
  return {
      reply_markup: JSON.stringify({
          inline_keyboard: [
              [{ text: 'Назад к тарифам', callback_data: 'back_to_tariffs' }]
          ]
      })
  };
};

const sendTariffSelection = (bot, chatId) => {
  try {
      bot.sendMessage(chatId, 'Выберите тариф:', {
          reply_markup: JSON.stringify({
              inline_keyboard: [
                [{ text: 'VIP 0 — 🌇20 и 🌃3 Мбит/с, 60т сум', callback_data: 'vip_0_tariff' }],
                [{ text: 'VIP 1 — 🌇100 и 🌃7 Мбит/с, 85т сум', callback_data: 'vip_1_tariff' }],
                [{ text: 'VIP 2 — 🌇100 и 🌃15 Мбит/с, 95т сум', callback_data: 'vip_2_tariff' }],
                [{ text: 'VIP 3 — 🌇100 и 🌃20 Мбит/с, 110т сум', callback_data: 'vip_3_tariff' }],
                [{ text: 'VIP 4 — 🌇100 и 🌃50 Мбит/с, 140т сум', callback_data: 'vip_4_tariff' }],
                [{ text: 'VIP 5 — 🌇100 и 🌃60 Мбит/с, 165т сум', callback_data: 'vip_5_tariff' }],
                [{ text: 'VIP 6 — 🌇100 и 🌃75 Мбит/с, 180т сум', callback_data: 'vip_6_tariff' }],
                [{ text: 'VIP 8 — 🌇100 и 🌃100 Мбит/с, 230т сум', callback_data: 'vip_8_tariff' }],
                [{ text: 'GT 1 — 🌇200 и 🌃50 Мбит/с, 165т сум', callback_data: 'gt_1_tariff' }],
                [{ text: 'GT 2 — 🌇200 и 🌃75 Мбит/с, 250т сум', callback_data: 'gt_2_tariff' }],
                [{ text: 'GT 3 — 🌇200 и 🌃100 Мбит/с, 300т сум', callback_data: 'gt_3_tariff' }],
              ]
          })
      });
  } catch (e) {
      console.log("----------- ERROR -----------");
      console.log(e);
      console.log("----------- /ERROR -----------");
  }
};

const tariffDescriptions = {
  'vip_0_tariff': 'Тариф VIP 0: с 00:00 до 19:00 - 20 Мбит/с, с 19:00 до 00:00 - 3 Мбит/с, стоимость 60 000 сум в месяц. \nИдеально подходит для домашнего пользования.\n\nhttps://gals.uz/tarif/vip-0/',
  'vip_1_tariff': 'Тариф VIP 1: с 00:00 до 19:00 - 100 Мбит/с, с 19:00 до 00:00 - 7 Мбит/с, стоимость 85 000 сум в месяц. \nОтличный выбор для активных пользователей интернета.\n\nhttps://gals.uz/tarif/vip-1/',
  'vip_2_tariff': 'Тариф VIP 2: с 00:00 до 19:00 - 100 Мбит/с, с 19:00 до 00:00 - 15 Мбит/с, стоимость 95 000 сум в месяц. \nДля тех, кто нуждается в высокой скорости в любое время суток.\n\nhttps://gals.uz/tarif/vip-2/',
  'vip_3_tariff': 'Тариф VIP 3: с 00:00 до 19:00 - 100 Мбит/с, с 19:00 до 00:00 - 20 Мбит/с, стоимость 110 000 сум в месяц. \nИдеален для пользователей, требующих немного больше скорости ночью.\n\nhttps://gals.uz/tarif/vip-3/',
  'vip_4_tariff': 'Тариф VIP 4: с 00:00 до 19:00 - 100 Мбит/с, с 19:00 до 00:00 - 50 Мбит/с, стоимость 140 000 сум в месяц. \nПодходит для семейного просмотра видео в высоком разрешении.\n\nhttps://gals.uz/tarif/vip-4/',
  'vip_5_tariff': 'Тариф VIP 5: с 00:00 до 19:00 - 100 Мбит/с, с 19:00 до 00:00 - 60 Мбит/с, стоимость 165 000 сум в месяц. \nОтлично подходит для загрузки и отправки больших файлов.\n\nhttps://gals.uz/tarif/vip-5/',
  'vip_6_tariff': 'Тариф VIP 6: с 00:00 до 19:00 - 100 Мбит/с, с 19:00 до 00:00 - 75 Мбит/с, стоимость 180 000 сум в месяц. \nИдеален для высокоскоростного интернет-серфинга и онлайн-игр.\n\nhttps://gals.uz/tarif/vip-6/',
  'vip_8_tariff': 'Тариф VIP 8: с 00:00 до 19:00 - 100 Мбит/с, с 19:00 до 00:00 - 100 Мбит/с, стоимость 230 000 сум в месяц. \nМаксимальная скорость для самых требовательных пользователей.\n\nhttps://gals.uz/tarif/vip-8/',
  'gt_1_tariff': 'Тариф GT 1: с 00:00 до 19:00 - 200 Мбит/с, с 19:00 до 00:00 - 50 Мбит/с, стоимость 165 000 сум в месяц. \nДля геймеров и стримеров, требующих максимальную скорость.\n\nhttps://gals.uz/tarif/gt_1/',
  'gt_2_tariff': 'Тариф GT 2: с 00:00 до 19:00 - 200 Мбит/с, с 19:00 до 00:00 - 75 Мбит/с, стоимость 250 000 сум в месяц. \nПревосходный выбор для профессиональных пользователей и больших семей.\n\nhttps://gals.uz/tarif/gt_2/',
  'gt_3_tariff': 'Тариф GT 3: с 00:00 до 19:00 - 200 Мбит/с, с 19:00 до 00:00 - 100 Мбит/с, стоимость 300 000 сум в месяц. \nВершина предложений для самых требовательных клиентов.\n\nhttps://gals.uz/tarif/gt_3/',
};



const handleTariffSelection = (bot, chatId, callbackData) => {
  if (callbackData.endsWith('_tariff') || callbackData.startsWith('gt_')) {
    const tariffInfo = tariffDescriptions[callbackData];
    bot.sendMessage(chatId, tariffInfo, backButton());
  } else if (callbackData === 'back_to_tariffs') {
      sendTariffSelection(bot, chatId);
  }

};

module.exports = {
  sendTariffSelection,
  handleTariffSelection
};
