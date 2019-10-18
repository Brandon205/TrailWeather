'use strict';
module.exports = (sequelize, DataTypes) => {
  const usersTrails = sequelize.define('usersTrails', {
    userId: DataTypes.STRING,
    trailId: DataTypes.STRING
  }, {});
  usersTrails.associate = function(models) {
    // associations can be defined here
  };
  return usersTrails;
};