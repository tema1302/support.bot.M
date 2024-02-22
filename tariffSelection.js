const backButton = () => {
  return {
      reply_markup: JSON.stringify({
          inline_keyboard: [
              [{ text: 'Назад к тарифам', callback_data: 'tariff handleTariffSelection back_to_tariffs' }]
          ]
      })
  };
};

const sendTariffSelection = (bot, chatId) => {
  try {
      bot.sendMessage(chatId, 'Выберите тариф:', {
          reply_markup: JSON.stringify({
              inline_keyboard: [
                [{ text: 'VIP 0 — 🌇20 и 🌃3 Мбит/с, 60т сум', callback_data: 'tariff handleTariffSelection vip_0' }],
                [{ text: 'VIP 1 — 🌇100 и 🌃7 Мбит/с, 85т сум', callback_data: 'tariff handleTariffSelection vip_1' }],
                [{ text: 'VIP 2 — 🌇100 и 🌃15 Мбит/с, 95т сум', callback_data: 'tariff handleTariffSelection vip_2' }],
                [{ text: 'VIP 3 — 🌇100 и 🌃20 Мбит/с, 110т сум', callback_data: 'tariff handleTariffSelection vip_3' }],
                [{ text: 'VIP 4 — 🌇100 и 🌃50 Мбит/с, 140т сум', callback_data: 'tariff handleTariffSelection vip_4' }],
                [{ text: 'VIP 5 — 🌇100 и 🌃60 Мбит/с, 165т сум', callback_data: 'tariff handleTariffSelection vip_5' }],
                [{ text: 'VIP 6 — 🌇100 и 🌃75 Мбит/с, 180т сум', callback_data: 'tariff handleTariffSelection vip_6' }],
                [{ text: 'VIP 8 — 🌇100 и 🌃100 Мбит/с, 230т сум', callback_data: 'tariff handleTariffSelection vip_8' }],
                [{ text: 'GT 1 — 🌇200 и 🌃50 Мбит/с, 165т сум', callback_data: 'tariff handleTariffSelection gt_1' }],
                [{ text: 'GT 2 — 🌇200 и 🌃75 Мбит/с, 250т сум', callback_data: 'tariff handleTariffSelection gt_2' }],
                [{ text: 'GT 3 — 🌇200 и 🌃100 Мбит/с, 300т сум', callback_data: 'tariff handleTariffSelection gt_3' }],
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
      caption = `**Тариф VIP 0**

      Самый дешевый во всей линейке наших тарифов.
      
      Данный бюджетный тариф был разработан специально для тех, кому не нужны высокие скорости, но нужен постоянный доступ в интернет для поиска информации без просмотра видео на высоких разрешениях или без скачивания больших файлов.
      
      - Интернет с 00:00 до 19:00 - **20 Мбит/с**
      - Интернет с 19:00 до 00:00 - **3 Мбит/с**
      - Tas-IX - **100 Мбит/с** (Скорость доступа в сеть Tas-IX не меняется)
      - SMS Оповещение
      
      Подробнее о тарифе на сайте: [https://gals.uz/tarifs/vip-0/](https://gals.uz/tarifs/vip-0/)
      `;
      break;
    case 'vip_1':
      photo = './assets/images/VIP1.jpg';
      caption = `**Тариф VIP 1**

      Следующий из наших бюджетных тарифов. Здесь уже выше скорости как в загруженный период, так и в менее загруженный, где вы можете спокойно смотреть фильмы и сериалы при 100 Мбит/с.
      
      - Интернет с 00:00 до 19:00 - **100 Мбит/с**
      - Интернет с 19:00 до 00:00 - **7 Мбит/с**
      - Tas-IX - **100 Мбит/с** (Скорость доступа в сеть Tas-IX не меняется)
      - SMS Оповещение
      
      Подробнее о тарифе на сайте: [https://gals.uz/tarifs/vip-1/](https://gals.uz/tarifs/vip-1/)
      `;
      break;
    case 'vip_2':
      photo = './assets/images/VIP2.jpg';
      caption = `**Тариф VIP 2**

      Отличный тариф за свои деньги. В данном тарифе скорость интернета в загруженное время уже больше в два раза чем предыдущий тариф, в остальное время вы можете даже не думать о скорости интернета, так как все равно все будет летать.
      
      - Интернет с 00:00 до 19:00 - **100 Мбит/с**
      - Интернет с 19:00 до 00:00 - **15 Мбит/с**
      - Tas-IX - **100 Мбит/с** (Скорость доступа в сеть Tas-IX не меняется)
      - SMS Оповещение
      
      Подробнее о тарифе на сайте: [https://gals.uz/tarifs/vip-2](https://gals.uz/tarifs/vip-2)
      `;
      break;
    case 'vip_3':
      photo = './assets/images/VIP3.jpg';
      caption = `**Тариф VIP 3**

      Более серьезный тариф. Тут уже для тех, кому важно получать стабильную минимально высокую скорость в любое время суток.
      
      - Интернет с 00:00 до 19:00 - **100 Мбит/с**
      - Интернет с 19:00 до 00:00 - **20 Мбит/с**
      - Tas-IX - **100 Мбит/с** (Скорость доступа в сеть Tas-IX не меняется)
      - SMS Оповещение
      
      Подробнее о тарифе на сайте: [https://gals.uz/tarifs/vip-3/](https://gals.uz/tarifs/vip-3/)
      `;
      break;
    case 'vip_4':
      photo = './assets/images/VIP4.jpg';
      caption = `**Тариф VIP 4**

      Идем на повышение! В этом тарифе уже минимальная скорость это 50 Мбит/с. Для тех, кто серьезно относится к доступу в интернет и хочет использовать его на серьезных скоростях.
      
      - Интернет с 00:00 до 19:00 - **100 Мбит/с**
      - Интернет с 19:00 до 00:00 - **50 Мбит/с**
      - Tas-IX - **100 Мбит/с** (Скорость доступа в сеть Tas-IX не меняется)
      - SMS Оповещение
      
      Подробнее о тарифе на сайте: [https://gals.uz/tarifs/vip-4/](https://gals.uz/tarifs/vip-4/)
      `;
      break;
    case 'vip_5':
      photo = './assets/images/VIP5.jpg';
      caption = `**Тариф VIP 5**

      Довольно быстро. Этот и последующий тариф уже нужны для тех, кто не хочет переживать о скорости в интернете или замечать, что что-то не грузится или грузится долго.
      
      - Интернет с 00:00 до 19:00 - **100 Мбит/с**
      - Интернет с 19:00 до 00:00 - **60 Мбит/с**
      - Tas-IX - **100 Мбит/с** (Скорость доступа в сеть Tas-IX не меняется)
      - SMS Оповещение
      
      Подробнее о тарифе на сайте: [https://gals.uz/tarifs/vip-5/](https://gals.uz/tarifs/vip-5/)
      `;
      break;
    case 'vip_6':
      photo = './assets/images/VIP6.jpg';
      caption = `**Тариф VIP 6**

      Ещё быстрее… Больше скорость, больше возможностей, особенно если вы работаете в интернете и вам нужен постоянный доступ.
      
      - Интернет с 00:00 до 19:00 - **100 Мбит/с**
      - Интернет с 19:00 до 00:00 - **75 Мбит/с**
      - Tas-IX - **100 Мбит/с** (Скорость доступа в сеть Tas-IX не меняется)
      - SMS Оповещение
      
      Подробнее о тарифе на сайте: [https://gals.uz/tarifs/vip-6/](https://gals.uz/tarifs/vip-6/)
      `;
      break;
    case 'vip_8':
      photo = './assets/images/VIP8.jpg';
      caption = `**Тариф VIP 8**

      Кажется, быстрее больше некуда. Это самый быстрый тариф в линейке тарифов VIP. Где вы можете использовать интернет круглосуточно на скорости 100 Мбит/с.
      
      - Интернет с 00:00 до 19:00 - **100 Мбит/с**
      - Интернет с 19:00 до 00:00 - **100 Мбит/с**
      - Tas-IX - **100 Мбит/с** (Скорость доступа в сеть Tas-IX не меняется)
      - SMS Оповещение
      
      Подробнее о тарифе на сайте: [https://gals.uz/tarifs/vip-8/](https://gals.uz/tarifs/vip-8/)
      `;
      break;
    case 'gt_1':
      photo = './assets/images/GT1.jpg';
      caption = `**Тариф GT 1**

      Новые рубежи скорости в интернет. Тарифы в новой линейке GT, где скорость поднимается до 200 Мбит/с. Для тех, кто не знает границ и не ставит лимитов.
      
      - Интернет с 00:00 до 19:00 - **200 Мбит/с**
      - Интернет с 19:00 до 00:00 - **50 Мбит/с**
      - Tas-IX - **100 Мбит/с** (Скорость доступа в сеть Tas-IX не меняется)
      - SMS Оповещение
      
      Подробнее о тарифе на сайте: [https://gals.uz/tarifs/gt_1/](https://gals.uz/tarifs/gt_1/)
      `;
      break;
    case 'gt_2':
      photo = './assets/images/GT2.jpg';
      caption = `**Тариф GT 2**

      Продолжаем удивлять. Очередной тариф в линейке GT, где скорость поднимается до 200 Мбит/с, а минимально опускается до 75 Мбит/с. Круто, что сказать…
      
      - Интернет с 00:00 до 19:00 - **200 Мбит/с**
      - Интернет с 19:00 до 00:00 - **75 Мбит/с**
      - Tas-IX - **100 Мбит/с** (Скорость доступа в сеть Tas-IX не меняется)
      - SMS Оповещение
      
      Подробнее о тарифе на сайте: [https://gals.uz/tarifs/gt_2/](https://gals.uz/tarifs/gt_2/)
      `;
      break;
    case 'gt_3':
      photo = './assets/images/GT3.jpg';
      caption = `**Тариф GT 3**

      Ну всё, быстрее некуда… Самый быстрый тариф среди всех тарифов нашей компании. Наслаждайтесь!
      
      - Интернет с 00:00 до 19:00 - **200 Мбит/с**
      - Интернет с 19:00 до 00:00 - **100 Мбит/с**
      - Tas-IX - **100 Мбит/с** (Скорость доступа в сеть Tas-IX не меняется)
      - SMS Оповещение
      
      Подробнее о тарифе на сайте: [https://gals.uz/tarifs/gt_3/](https://gals.uz/tarifs/gt_3/)
      `;
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
