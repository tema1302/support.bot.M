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
};

const handleTariffSelection = (bot, chatId, callbackData) => {
  // Здесь должна быть логика для обработки выбранного тарифа
  // Например, для vip_0:
  if (callbackData.startsWith('vip_')) {
      const tariffInfo = `Информация о выбранном тарифе: ${callbackData}. Подробное описание тарифа...`;
      bot.sendMessage(chatId, tariffInfo, backButton());
  } else if (callbackData === 'back_to_tariffs') {
      sendTariffSelection(bot, chatId);
  }
  // Добавьте логику для других тарифов
};

module.exports = {
  sendTariffSelection,
  handleTariffSelection
};
