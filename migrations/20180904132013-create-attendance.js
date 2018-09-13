module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Attendances', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    memberId: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    reason: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('Attendances'),
};
