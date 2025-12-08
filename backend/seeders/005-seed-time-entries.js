'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('time_entries', [
      {
        project_id: 1,
        task_id: 1,
        user_id: 1,
        start_time: '2024-01-25 09:00:00',
        end_time: '2024-01-25 12:00:00',
        duration_minutes: 180,
        description: 'Homepage design work',
        is_billable: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        project_id: 1,
        task_id: 1,
        user_id: 1,
        start_time: '2024-01-25 13:00:00',
        end_time: '2024-01-25 17:00:00',
        duration_minutes: 240,
        description: 'Homepage design continuation',
        is_billable: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        project_id: 2,
        task_id: 3,
        user_id: 1,
        start_time: '2024-02-01 10:00:00',
        end_time: '2024-02-01 14:00:00',
        duration_minutes: 240,
        description: 'Planning and setup',
        is_billable: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('time_entries', null, {});
  },
};
