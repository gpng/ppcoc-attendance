module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    'Member',
    {
      name: DataTypes.STRING,
      status: DataTypes.STRING,
      remarks: DataTypes.STRING,
      lastAttendance: DataTypes.DATE,
    },
    {},
  );
  Member.associate = (models) => {
    // associations can be defined here
    Member.hasMany(models.Attendance, {
      foreignKey: 'memberId',
    });
  };
  return Member;
};
