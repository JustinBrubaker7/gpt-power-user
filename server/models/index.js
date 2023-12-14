const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'gpt-power-users',
    'dpthat6vace3j0ems8gp',
    'pscale_pw_5oxqtC9y0h6BiDRZHT654jvumsUekJ3Qs2fqaWQcB3L',
    {
        host: 'aws.connect.psdb.cloud',
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                // This is the key part for SSL configuration
                require: true,
                rejectUnauthorized: true, // This ensures you do not connect to a DB that is not properly SSL secured
                // If you have a CA certificate, you can specify it here
                // ca: fs.readFileSync('path/to/ca-cert.pem').toString(),
            },
        },
    }
);

const db = {
    sequelize: sequelize,
    Sequelize: Sequelize,
    User: require('./user')(sequelize, Sequelize.DataTypes),
};

db.sequelize
    .authenticate()
    .then(() => console.log('Database connected.'))
    .catch((err) => console.error('Unable to connect to the database:', err));

db.sequelize
    .sync()
    .then(() => console.log('Models synced'))
    .catch((err) => console.error('Error syncing models:', err));

module.exports = db;
