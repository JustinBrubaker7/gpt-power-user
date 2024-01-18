const { Shortcut } = require('../models/index');

const getAllShortCuts = async (req, res) => {
    try {
        const shortcuts = await Shortcut.findAll({
            where: {
                userId: req.query.userId,
            },
        });
        res.status(200).json({ shortcuts });
    } catch (error) {
        console.error(error);
    }
};

const createShortcut = async (req, res) => {
    try {
        const shortcut = await Shortcut.create(req.body);
        res.status(200).json({ shortcut });
    } catch (error) {
        console.error(error);
    }
};

module.exports = { getAllShortCuts, createShortcut };
