'use strict'

const userDAO = require('../dao/userDAO')

class UserService {
    db;

    constructor(db) {
        this.db = db;
    }

    async addUser(user) {
        await this.db.save(user);
    }

    async getUserByTag(userTag) {
        const user = await this.db.get(userTag);
        return user;
    }

    async deleteUser(userTag) {
        await this.db.delete(userTag);
    }
}

module.exports = {
    UserService, 
    userService: new UserService(userDAO) 
};
