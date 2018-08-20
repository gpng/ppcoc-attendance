'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Members',
      [
        {
          firstName: 'Michael',
          lastName: 'Tan',
          contact: '+65 1234567',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: 'Jill',
          lastName: 'Chong',
          contact: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Person', null, {});
  }
};
