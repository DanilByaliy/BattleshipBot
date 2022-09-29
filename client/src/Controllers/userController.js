const hendler = require('../Hendlers/hendler');

module.exports = async (msg) => {
    const { id, username } = msg.chat;
    try {
        await hendler.start(id, username);
        bot.sendMessage(id, 'Welcome new user');
    } catch {
        bot.sendMessage(id, 'Something went wrong, please try again later');
    }
}