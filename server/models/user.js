module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        // Unique identifier for the user
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        // User's email for identification and login
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        // Username for display and interaction
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        // Securely hashed password for authentication
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Optional: Role for user authorization (e.g., admin, user)
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user',
        },
        // Timestamps
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    });

    return User;
};
