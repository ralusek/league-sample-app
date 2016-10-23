'use strict';


const sequelize = require('../../config/database_connections').sequelize.primary;
const Sequelize = require('sequelize');
const userBehaviors = require('./behaviors');

const CONSTANTS = require('./constants');

const DEFINITION_OBJECT = {
  firstName: {type: Sequelize.STRING},
  lastName: {type: Sequelize.STRING},
  email: {type: Sequelize.STRING, allowNull: false},
  password: {type: Sequelize.STRING, allowNull: false},
  religion: {type: Sequelize.STRING},
  gender: {type: Sequelize.STRING},
  DOB: {type: Sequelize.DATE}
};

const CONFIGURATION_OBJECT = {
  name: {
    singular: 'user',
    plural: 'users'
  },
  defaultScope: {
    attributes: {exclude: ['password']}
  },
  underscored: true,
  indexes : [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['firstName']
    },
    {
      fields: ['lastName']
    }
  ]
};



CONFIGURATION_OBJECT.classMethods = userBehaviors.classMethods;
CONFIGURATION_OBJECT.instanceMethods = userBehaviors.instanceMethods;
CONFIGURATION_OBJECT.hooks = userBehaviors.hooks;
CONFIGURATION_OBJECT.scopes = userBehaviors.scopes;

const UserModel = sequelize.define(CONSTANTS.MODEL, DEFINITION_OBJECT, CONFIGURATION_OBJECT);

UserModel.establishRelationships = () => {
  UserModel.hasOne(DIR().PreferenceModel, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});
  UserModel.hasOne(DIR().RatingModel, {as: 'isRater', foreignKey: {name: 'rater_id', allowNull: false}, onDelete: 'CASCADE'});
  UserModel.hasOne(DIR().RatingModel, {as: 'isRated', foreignKey: {name: 'rated_id', allowNull: false}, onDelete: 'CASCADE'});
};

module.exports = Object.assign(UserModel, CONSTANTS);

const DIR = require('../directory');

