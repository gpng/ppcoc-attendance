module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    'Member',
    {
      name: DataTypes.STRING,
      contact: DataTypes.STRING,
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
