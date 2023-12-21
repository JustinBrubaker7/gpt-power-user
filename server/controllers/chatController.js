const { Chat } = require('../models/index');
const { getChatTitleSummary } = require('./openai/openaiUtils');
const { Op } = require('sequelize');

const addChat = async (chatData, settings) => {
    try {
        if (settings.conversationType !== 'continue') {
            const message = await Chat.create({
                userId: settings.userId,
                model: settings.model, // Ensure this is provided in settings
                messages: JSON.stringify(chatData),
                title: chatData.title, // Optional, ensure it's provided if needed
            });
            return { message: message, id: message.id };
        } else if (settings.conversationType === 'continue') {
            await Chat.update(
                {
                    title: chatData.title, // Assuming title is provided
                    messages: JSON.stringify(chatData),
                },
                {
                    where: {
                        userId: settings.userId,
                        id: settings.id,
                    },
                }
            );
            return { message: 'Chat updated successfully' };
        } else {
            return { message: 'Invalid conversationType', status: 400 };
        }
    } catch (error) {
        console.error(error);
        return { message: 'Internal server error', status: 500 };
    }
};

const getAllChats = async (req, res) => {
    try {
        const chats = await Chat.findAll({
            where: {
                userId: req.query.userId,
            },
        });

        // order chats by date
        chats.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        res.status(200).json({ chats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getOneChat = async (req, res) => {
    try {
        const chat = await Chat.findOne({
            where: {
                id: req.query.chatId,
                userId: req.query.userId,
            },
        });
        res.status(200).json({ chat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const nameChats = async () => {
    try {
        const chats = await Chat.findAll({
            where: {
                title: {
                    [Op.or]: [null, ''],
                },
            },
        });

        if (!chats.length) {
            return;
        }
        for (const chat of chats) {
            // call openAI controler
            const title = await getChatTitleSummary(JSON.parse(chat.messages));
            // update chat title
            await Chat.update(
                {
                    title: title,
                },
                {
                    where: {
                        id: chat.id,
                    },
                }
            );
        }
    } catch (error) {
        console.error(error);
    }
};

module.exports = { addChat, getAllChats, getOneChat, nameChats };
