const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const path = require('path');
const verifyToken = require('./middleware/authMiddleware');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

require('dotenv').config({ path: path.resolve(__dirname, './.env') });

console.log(process.env.JWT_SECRET);

// router.get('/chat', verifyToken, chatController.getChat);

const authRoutes = require('./routes/auth');
// const chatRoutes = require('./routes/chat');
// const openaiRoutes = require('./routes/openai');

app.use('/auth', authRoutes);
// app.use('/chat', chatRoutes);
// app.use('/openai', openaiRoutes);

// route that says hello
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

// Server Listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
