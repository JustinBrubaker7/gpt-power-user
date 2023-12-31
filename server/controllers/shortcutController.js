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

module.exports = { getAllShortCuts };
