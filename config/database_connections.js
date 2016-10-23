const Promise = require('bluebird');

const sequelizeConnect = require('../database/sequelize');

const sequelize = {
  primary: sequelizeConnect.newClient({
    db: 'league_sample', // Would normally be an environment var.
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PW,
    dialect: sequelizeConnect.DIALECT.POSTGRES
  })
};
module.exports.sequelize = sequelize;

module.exports.connectAll = () => {
  console.log('Connecting to all databases...');

  return sequelizeConnect.connect(sequelize.primary)
  .tap(sequelizeClient => {
    setTimeout(() => {
      sequelizeClient.sync({force: false});
    }, 3500);
  });
};
