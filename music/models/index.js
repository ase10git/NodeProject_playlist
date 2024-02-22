'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.json');
const { database, username, password, host, port, dialect } = config.development;
const db = {};

const sequelize = new Sequelize(database, username, password, { host, port, dialect});

const User = require('./user')(sequelize, DataTypes);
const Genre = require('./genre')(sequelize, DataTypes);
const Music = require('./music')(sequelize, DataTypes);

db.User = User;
db.Genre = Genre;
db.Music = Music;
module.exports = db;