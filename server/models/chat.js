module.exports = (sequelize, DataTypes) => {
    const Chat = sequelize.define(
        'Chat',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            model: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            messages: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            // Model options
            indexes: [
                {
                    name: 'user_id_index',
                    fields: ['userId'],
                },
                {
                    name: 'chat_created_at_index',
                    fields: ['createdAt'],
                },
            ],
        }
    );
    return Chat;
};
