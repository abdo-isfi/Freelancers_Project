'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('projects', [
      {
        user_id: 1,
        client_id: 1,
        name: 'Website Redesign',
        description: 'Complete redesign of company website',
        billing_type: 'fixed_price',
        hourly_rate: null,
        day_rate: null,
        fixed_amount: '5000.00',
        status: 'active',
        start_date: '2024-01-15',
        end_date_estimated: '2024-03-15',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 1,
        client_id: 2,
        name: 'Mobile App Development',
        description: 'iOS and Android app development',
        billing_type: 'hourly',
        hourly_rate: '75.00',
        day_rate: null,
        fixed_amount: null,
        status: 'active',
        start_date: '2024-02-01',
        end_date_estimated: '2024-06-01',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,
        client_id: 3,
        name: 'Brand Identity Design',
        description: 'Logo, guidelines, and brand assets',
        billing_type: 'day_rate',
        hourly_rate: null,
        day_rate: '600.00',
        fixed_amount: null,
        status: 'finished',
        start_date: '2024-01-10',
        end_date_estimated: '2024-02-10',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('projects', null, {});
  },
};
