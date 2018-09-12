// reference http://balamcode.com/2018/03/05/full-text-search-on-postgres-with-sequelize/

module.exports = {
  up: (queryInterface) => {
    queryInterface.addIndex('Members', {
      fields: ['name'],
      using: 'gin',
      operator: 'gin_trgm_ops',
    });
  },

  down: (queryInterface) => {
    queryInterface.removeIndex('Members', 'name');
  },
};
