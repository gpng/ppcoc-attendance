module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    'Member',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      contact: DataTypes.STRING
    },
    {}
  );
  Member.associate = function(models) {
    // associations can be defined here
    Member.hasMany(models.Attendance, {
      foreignKey: 'memberId'
    });
  };
  return Member;
};
