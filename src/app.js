const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

// Express
const app = express();

// JSON
app.use(express.json())

// Routes
app.use(userRouter);
app.use(taskRouter);

module.exports = app;