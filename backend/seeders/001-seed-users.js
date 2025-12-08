'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        email: 'john@example.com',
        password_hash: '$2b$10$YourHashedPasswordHere1', // Use bcrypt hash in real app
        first_name: 'John',
        last_name: 'Doe',
        currency: 'EUR',
        company_name: 'John Doe Freelance',
        address: '123 Main St, City, Country',
        tax_id: 'TX123456789',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'jane@example.com',
        password_hash: '$2b$10$YourHashedPasswordHere2',
        first_name: 'Jane',
        last_name: 'Smith',
        currency: 'USD',
        company_name: 'Jane Smith Design',
        address: '456 Oak Ave, City, Country',
        tax_id: 'TX987654321',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
