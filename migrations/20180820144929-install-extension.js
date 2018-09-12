module.exports = {
  up: queryInterface => queryInterface.sequelize.query('CREATE EXTENSION pg_trgm;'),
  down: queryInterface => queryInterface.sequelize.query('DROP EXTENSION pg_trgm;'),
};
