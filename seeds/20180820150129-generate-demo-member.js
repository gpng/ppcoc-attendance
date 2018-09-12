'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Members',
      [
        {
          name: 'Michael Tan',
          contact: '+65 1234567',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Jill Chong',
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
