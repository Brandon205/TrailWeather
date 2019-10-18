'use strict';
module.exports = (sequelize, DataTypes) => {
  const location = sequelize.define('location', {
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    lat: DataTypes.STRING,
    long: DataTypes.STRING
  }, {});
  location.associate = function(models) {
    // associations can be defined here
    models.location.belongsToMany(models.user, { through: 'usersLocations' });
  };
  return location;
};
