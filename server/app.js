const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');
const cron = require('node-cron');
const { verifyToken, verifyTokenSync } = require('./middleware/authMiddleware');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const { nameChats } = require('./controllers/chatController');
const app = express();
const server = http.createServer(app);
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

console.log(process.env.JWT_SECRET);

// router.get('/chat', verifyToken, chatController.getChat);

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
// const openaiRoutes = require('./routes/openai');

app.use('/auth', authRoutes);
app.use('/chat', verifyToken, chatRoutes);
// app.use('/openai', openaiRoutes);

// route that says hello
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

const { completeChatStream } = require('./controllers/openai/openaiController');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws, req) {
    // Extract token from the request
    const token = req.url.split('userId=')[1]; // Adjust this based on how the token is sent

    // Verify the token
    try {
        const decoded = verifyTokenSync(token);
        // Token is valid, you can add user info to the WebSocket object if needed
        ws.user = decoded.user;

        ws.on('message', function incoming(message) {
            console.log('received: %s', message);
            completeChatStream({ ws, message, WebSocket });
        });

        ws.on('close', () => console.log('Client has disconnected'));
    } catch (error) {
        // Token is invalid, close the connection
        console.log('Invalid token, closing connection');
        ws.close();
    }
});

// // Schedule a task to run every minute
cron.schedule('* * * * *', () => {
    console.log('Running a task every minute');
    nameChats(); // Call the function from chatController
});

// Server Listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
