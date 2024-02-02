const i18n = require('i18n');
const path = require('path');

i18n.configure({
    locales: ['uz', 'ru'],
    directory: path.join(__dirname, '../locales'),
    defaultLocale: 'ru',
    objectNotation: true,
});

module.exports = i18n;
