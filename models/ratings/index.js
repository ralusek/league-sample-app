'use strict';


const sequelize = require('../../config/database_connections').sequelize.primary;
const Sequelize = require('sequelize');
const ratingBehaviors = require('./behaviors');

const CONSTANTS = require('./constants');

const DEFINITION_OBJECT = {
  rating: {
    type: Sequelize.ENUM(
      CONSTANTS.RATING.LIKE,
      CONSTANTS.RATING.REJECT
    )
  }
};

const CONFIGURATION_OBJECT = {
  name: {
    singular: 'rating',
    plural: 'ratings'
  },
  underscored: true,
  indexes : [
    {
      fields: ['rater_id']
    },
    {
      fields: ['rated_id']
    },
    {
      fields: ['rater_id', 'rated_id'],
      unique: true
    }
  ]
};



CONFIGURATION_OBJECT.classMethods = ratingBehaviors.classMethods;
CONFIGURATION_OBJECT.instanceMethods = ratingBehaviors.instanceMethods;
CONFIGURATION_OBJECT.hooks = ratingBehaviors.hooks;
CONFIGURATION_OBJECT.scopes = ratingBehaviors.scopes;

const RatingModel = sequelize.define(CONSTANTS.MODEL, DEFINITION_OBJECT, CONFIGURATION_OBJECT);

RatingModel.establishRelationships = () => {
  RatingModel.belongsTo(DIR().UserModel, {as: 'rater', foreignKey: {name: 'rater_id', allowNull: false}, onDelete: 'CASCADE'});
  RatingModel.belongsTo(DIR().UserModel, {as: 'rated', foreignKey: {name: 'rated_id', allowNull: false}, onDelete: 'CASCADE'});
};

module.exports = Object.assign(RatingModel, CONSTANTS);

const DIR = require('../directory');

