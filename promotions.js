
const i18n = require('./config/i18n');

function displayPromotions(bot, chatId) {
  try {
    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: i18n.__('bring_a_friend_promotion'), callback_data: 'menuHandler handleMenuAction bring_a_friend' }],
                [{ text: i18n.__('promo_300_promotion'), callback_data: 'menuHandler handleMenuAction promo_300' }],
                [{ text: i18n.__('free_cable_promotion'), callback_data: 'menuHandler handleMenuAction free_cable' }],
                [{ text: i18n.__('back_menu'), callback_data: 'menuHandler handleMenuAction back_to_menu' }]
            ]
        })
    };
    bot.sendMessage(chatId, i18n.__('Выберите акцию:'), options);
  } catch (e) {
    console.log("----------- ERROR -----------");
    console.log(e);
    console.log("----------- /ERROR -----------");
  }
}
function handlePromotionSelection(bot, chatId, action) {
  
  const promotions = {
    'bring_a_friend': {
      image: './assets/images/bring_a_friend_image.jpg',
      text: i18n.__('bring_a_friend_description')
    },
    'promo_300': {
      image: './assets/images/promo_300_image.jpg',
      text: i18n.__('promo_300_description')
    },
    'free_cable': {
      image: './assets/images/free_cable_image.jpg',
      text: i18n.__('free_cable_description')
    }
  };

  const promotion = promotions[action];

  if (promotion) {
    bot.sendPhoto(chatId, promotion.image, {
      caption: promotion.text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: i18n.__('back_to_promotions'), callback_data: 'menuHandler handleMenuAction back_to_promotions' }]
        ]
      })
    });
  } else {
    console.log("Непредвиденный выбор акции:", action);
  }
}


module.exports = { displayPromotions, handlePromotionSelection };
// Участвуйте в акции «Приведи друга» — это выгодно!\n
// Хотите получить бесплатный месяц интернета от «Gals Telecom»? У нас есть для вас отличная акция «Приведи друга». Просто следуйте этим простым шагам, чтобы воспользоваться этой возможностью.\n
// <b>Шаг 1:</b> Будьте абонентом «Gals Telecom»\n
// Для участия в акции «Приведи друга» вы должны быть абонентом нашей компании. Если вы уже пользуетесь услугами «Gals Telecom», переходите к следующему шагу. Если нет, свяжитесь с нами, чтобы подключиться к нашему интернету.\n
// <b>Шаг 2:</b> Посоветуйте другу подключиться к нашему интернету\n
// Расскажите вашему другу о нашем надежном и стабильном интернете и посоветуйте ему подключиться к «Gals Telecom». Передайте ему свой логин или адрес, чтобы он мог их использовать при обращении к нам.
// <b>Шаг 3:</b> Обратитесь к нам по рекомендации\n
// Проследите, чтобы ваш друг обратился к нам по вашей рекомендации, позвонив по номеру <code>71 202-96-66</code>. Важно, чтобы ваш друг назвал ваш логин или адрес во время обращения.\n
// <b>Шаг 4:</b> Получите бесплатный месяц интернета\n
// Мы зафиксируем информацию о рекомендации и подключении вашего друга. После успешного подключения вашего друга, вы получите бесплатный месяц интернета от «Gals Telecom»! Это наш способ поблагодарить вас за рекомендацию.\n
// Не упустите возможность получить бесплатный месяц интернета с «Gals Telecom». Приведите друга к нам, и вы оба будете наслаждаться быстрым и надежным интернетом.\n
//       Количество друзей не ограничено.`
