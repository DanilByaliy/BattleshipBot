'use strict'

const { userService } = require('../services/userService')

class UserController {
    async addUser(req, res) {
        try {
            const userData = req.body;
            const addedUser = await userService.addUser(userData);
            res.status(201).json(addedUser);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    
    async getUser(req, res) {
        try {
            const { tag } = req.params;
            const user = await userService.getUserByTag(tag);
            res.status(200).json(user);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const { tag } = req.params;
            const deletedUser = await trackServices.deleteUser(tag);
            res.status(200).json(deletedUser);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }
}

module.exports = new UserController();