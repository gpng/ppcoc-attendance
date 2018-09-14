const csv = require('csvtojson');

module.exports = {
  up: async (queryInterface) => {
    const csvFilePath = `${__dirname}/../members.csv`;
    const members = await csv().fromFile(csvFilePath);
    return queryInterface.bulkInsert('Members', members, {});
  },

  down: queryInterface => queryInterface.bulkDelete('Members', null, {}),
};
