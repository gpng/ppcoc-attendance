module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define(
    'Attendance',
    {
      memberId: DataTypes.INTEGER,
    },
    {},
  );
  Attendance.associate = (models) => {
    // associations can be defined here
    Attendance.belongsTo(models.Member, {
      foreignKey: 'member_id',
    });
  };
  return Attendance;
};
