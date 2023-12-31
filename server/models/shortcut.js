module.exports = (sequelize, DataTypes) => {
    const Shortcut = sequelize.define(
        'Shortcut',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            text: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            indexes: [
                {
                    name: 'shortcut_name_index',
                    fields: ['name'],
                },
                {
                    name: 'shortcut_text_index',
                    fields: ['text'],
                },
            ],
        }
    );
    return Shortcut;
};
