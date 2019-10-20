'use strict';
module.exports = (sequelize, DataTypes) => {
  const trail = sequelize.define('trail', {
    idnum: DataTypes.STRING,
    name: DataTypes.STRING
  }, {});
  trail.associate = function(models) {
    // associations can be defined here
    models.trail.belongsToMany(models.user, { through: 'usersTrails' });
  };
  return trail;
};
