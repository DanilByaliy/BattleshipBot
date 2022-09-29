'use strict'

const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');

userRouter.post('/', userController.addUser);

module.exports = userRouter;