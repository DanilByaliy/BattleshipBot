const userController = require('./Controllers/userController')

const listener = (bot) => {

    bot.onText(/\/start/, controller());

    bot.onText(/\/game (.+)/, (msg, [source, match]) => {
        
    });

    bot.on('callback_query', (query) => {

    });
}

module.exports = listener;