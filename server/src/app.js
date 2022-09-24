'use strict'

const express = require('express');
const app = express();
const userRouter = require('./routers/userRouter');
const port = 3000;

app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`Server listening on http://localhost/:${port}`);
});