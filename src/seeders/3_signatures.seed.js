const constants = require('../models/signatures/signatures.constants')

const collection = 'Signatures'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return insert(queryInterface, Sequelize)
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete(collection, null, {})
  }
}

async function insert (queryInterface) {
  const data = [
    {
      status: constants.status.ACTIVE,
      name: 'Alice Doe',
      jobTitle: 'President',
      image: 'data:image/png;base64,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',
      creatorId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
  return queryInterface.bulkInsert(collection, data)
}
