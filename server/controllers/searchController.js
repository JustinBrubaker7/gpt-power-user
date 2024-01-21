const { Chat } = require('../models/index');
const { Op } = require('sequelize');

const searchManyChats = async (req, res) => {
    try {
        const chats = await Chat.findAll({
            where: {
                title: {
                    [Op.like]: `%${req.query.searchQuery}%`,
                },
            },
        });
        res.status(200).json({ chats });
    } catch (error) {
        console.error(error);
    }
};

module.exports = { searchManyChats };
