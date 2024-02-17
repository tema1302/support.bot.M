const fs = require('fs');
const moment = require('moment');

const logFile = 'bot.log'; // Указываем имя файла логов

// Функция для добавления записи в лог
function logMessage(username, message) {
  const timestamp = moment().format('YYYY-MM-DD HH:mm:ss'); // Форматируем текущее время
  const logEntry = `${timestamp} - ${username}: ${message}\n`; // Формируем запись лога

  // Добавляем запись в файл
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) {
      console.error('Ошибка записи в файл лога:', err);
    }
  });
}

module.exports = { logMessage };
