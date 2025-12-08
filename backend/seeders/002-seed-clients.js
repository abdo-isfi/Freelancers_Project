'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('clients', [
      {
        user_id: 1,
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1-555-0101',
        company_name: 'Acme Corp',
        address: '789 Business Blvd, City, Country',
        tax_id: 'ACME123456',
        currency: 'EUR',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 1,
        name: 'TechStart Inc',
        email: 'hello@techstart.com',
        phone: '+1-555-0102',
        company_name: 'TechStart Inc',
        address: '321 Tech Way, City, Country',
        tax_id: 'TECH654321',
        currency: 'EUR',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,
        name: 'Design Studio',
        email: 'info@designstudio.com',
        phone: '+1-555-0103',
        company_name: 'Creative Design Studio',
        address: '654 Art St, City, Country',
        tax_id: 'DESIGN111111',
        currency: 'USD',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('clients', null, {});
  },
};
