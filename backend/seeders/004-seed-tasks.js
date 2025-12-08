'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tasks', [
      {
        project_id: 1,
        title: 'Homepage Design',
        description: 'Design the main landing page',
        status: 'completed',
        priority: 'high',
        due_date: '2024-02-01',
        estimated_hours: '16.00',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        project_id: 1,
        title: 'Services Page',
        description: 'Create services page layout',
        status: 'in_progress',
        priority: 'high',
        due_date: '2024-02-15',
        estimated_hours: '12.00',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        project_id: 2,
        title: 'API Integration',
        description: 'Integrate with backend API',
        status: 'todo',
        priority: 'high',
        due_date: '2024-03-01',
        estimated_hours: '24.00',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        project_id: 3,
        title: 'Logo Design',
        description: 'Create company logo',
        status: 'completed',
        priority: 'high',
        due_date: '2024-01-20',
        estimated_hours: '8.00',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tasks', null, {});
  },
};
