'use strict';


const sequelize = require('../../config/database_connections').sequelize.primary;
const Sequelize = require('sequelize');
const preferenceBehaviors = require('./behaviors');

const CONSTANTS = require('./constants');

const DEFINITION_OBJECT = {
  minAge: {type: Sequelize.INTEGER},
  maxAge: {type: Sequelize.INTEGER},
  gender: {type: Sequelize.ARRAY(Sequelize.STRING)},
  religion: {type: Sequelize.STRING},
  maxDistance: {type: Sequelize.INTEGER}
};

const CONFIGURATION_OBJECT = {
  name: {
    singular: 'preference',
    plural: 'preferences'
  },
  underscored: true,
  indexes : [
    {
      fields: ['user_id'],
      unique: true
    },
    {
      fields: ['minAge']
    },
    {
      fields: ['maxAge']
    },
    {
      fields: ['gender']
    },
    {
      fields: ['religion']
    },
    {
      fields: ['maxDistance']
    }
  ]
};



CONFIGURATION_OBJECT.classMethods = preferenceBehaviors.classMethods;
CONFIGURATION_OBJECT.instanceMethods = preferenceBehaviors.instanceMethods;
CONFIGURATION_OBJECT.hooks = preferenceBehaviors.hooks;
CONFIGURATION_OBJECT.scopes = preferenceBehaviors.scopes;

const PreferenceModel = sequelize.define(CONSTANTS.MODEL, DEFINITION_OBJECT, CONFIGURATION_OBJECT);

PreferenceModel.establishRelationships = () => {
  PreferenceModel.belongsTo(DIR().UserModel, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});
};

module.exports = Object.assign(PreferenceModel, CONSTANTS);

const DIR = require('../directory');

