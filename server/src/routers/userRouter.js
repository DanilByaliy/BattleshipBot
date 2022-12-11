'use strict'

const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');

userRouter.get('/:id', userController.getUser);
userRouter.post('/', userController.addUser);
userRouter.delete('/:id', userController.deleteUser);

module.exports = userRouter;