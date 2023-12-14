const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/index'); // Adjust the path as needed

const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create a new user
        const newUser = new User({ email, password: hashedPassword, username });
        await newUser.save();

        return res.status(200).send('User registered successfully');
    } catch (error) {
        return res.status(500).send('Internal Server Error');
    }
};

const login = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });

        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            // Create token
            const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

            return res.status(200).json({ token, userId: user.id, username: user.username, email: user.email });
        }

        return res.status(400).send('Invalid Credentials');
    } catch (error) {
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = { register, login };
