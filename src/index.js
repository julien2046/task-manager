const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

// Express
const app = express();
const port = process.env.PORT;

// JSON
app.use(express.json())

// Routes
app.use(userRouter);
app.use(taskRouter);

// Listen
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});