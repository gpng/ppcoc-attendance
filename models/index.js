'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];
const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(config);

const files = fs
  .readdirSync(__dirname)
  .filter(
    file => file.indexOf('.') > 0 && file !== basename && file !== 'config.js'
  );

for (const file of files) {
  const model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
}

for (const modelName of Object.keys(db)) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
