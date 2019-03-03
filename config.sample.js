module.exports = {
  development: {
    username: null,
    password: null,
    database: 'ppcoc',
    host: 'localhost',
    port: '5432',
    dialect: 'postgres',
    operatorsAliases: false,
    auth0ClientId: 'NBBz2scjvIpvMywd8Hyn4w7XIpAbTg8K',
    auth0Domain: 'gpng-dev.au.auth0.com',
  },
  production: {
    username:
      process.env.DB_USERNAME || process.env.DB_USERNAME === 'null'
        ? process.env.DB_USERNAME
        : null,
    password:
      process.env.DB_PASSWORD || process.env.DB_PASSWORD === 'null'
        ? process.env.DB_PASSWORD
        : null,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    operatorsAliases: false,
    auth0ClientId: process.env.AUTH0_CLIENT_ID,
    auth0Domain: process.env.AUTH0_DOMAIN,
  },
};
