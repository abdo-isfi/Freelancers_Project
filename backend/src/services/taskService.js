const { Task, Project } = require('../models');

class TaskService {
  /**
   * Get all tasks for a project
   */
  async getTasksByProject(projectId, userId, { page = 1, limit = 10, status = null } = {}) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const where = {};
    if (status) {
      where.status = status;
    }
    if (projectId) {
      where.project_id = projectId;
      // Verify project belongs to user
      const project = await Project.findOne({
        where: { id: projectId, user_id: userId },
      });

      if (!project) {
        const error = new Error('Project not found');
        error.status = 404;
        throw error;
      }
    }

    const { count, rows } = await Task.findAndCountAll({
      where,
      include: [{
        model: Project,
        where: { user_id: userId }, // Ensure tasks belong to user's projects
        attributes: ['id', 'name']
      }],
      offset,
      limit: limitNum,
      order: [['priority', 'DESC'], ['due_date', 'ASC']],
    });

    return {
      data: rows.map(this.formatTask),
      pagination: {
        total: count,
        page: pageNum,
        pages: Math.ceil(count / limitNum),
        limit: limitNum,
      },
    };
  }

  /**
   * Get task by ID
   */
  async getTaskById(taskId, userId) {
    const task = await Task.findByPk(taskId, {
      include: [{
        model: Project,
        where: { user_id: userId },
        attributes: ['id', 'name'],
      }],
    });

    if (!task) {
      const error = new Error('Task not found');
      error.status = 404;
      throw error;
    }

    return this.formatTask(task);
  }

  /**
   * Create new task
   */
  async createTask(userId, {
    projectId,
    title,
    description,
    priority,
    dueDate,
    estimatedHours,
  }) {
    // Verify project belongs to user
    const project = await Project.findOne({
      where: { id: projectId, user_id: userId },
    });

    if (!project) {
      const error = new Error('Project not found');
      error.status = 404;
      throw error;
    }

    const task = await Task.create({
      project_id: projectId,
      title,
      description,
      priority: priority || 'medium',
      due_date: dueDate,
      estimated_hours: estimatedHours,
      status: 'todo',
    });

    return this.formatTask(task);
  }

  /**
   * Update task
   */
  async updateTask(taskId, userId, updates) {
    const task = await Task.findByPk(taskId, {
      include: [{
        model: Project,
        where: { user_id: userId },
      }],
    });

    if (!task) {
      const error = new Error('Task not found');
      error.status = 404;
      throw error;
    }

    const mappedUpdates = {
      title: updates.title,
      description: updates.description,
      status: updates.status,
      priority: updates.priority,
      due_date: updates.dueDate,
      estimated_hours: updates.estimatedHours,
    };

    Object.keys(mappedUpdates).forEach((key) => {
      if (mappedUpdates[key] !== undefined) {
        task[key] = mappedUpdates[key];
      }
    });

    await task.save();

    return this.formatTask(task);
  }

  /**
   * Update task status
   */
  async updateTaskStatus(taskId, userId, status) {
    const task = await Task.findByPk(taskId, {
      include: [{
        model: Project,
        where: { user_id: userId },
      }],
    });

    if (!task) {
      const error = new Error('Task not found');
      error.status = 404;
      throw error;
    }

    task.status = status;
    await task.save();

    return this.formatTask(task);
  }

  /**
   * Delete task
   */
  async deleteTask(taskId, userId) {
    const task = await Task.findByPk(taskId, {
      include: [{
        model: Project,
        where: { user_id: userId },
      }],
    });

    if (!task) {
      const error = new Error('Task not found');
      error.status = 404;
      throw error;
    }

    await task.destroy();

    return { message: 'Task deleted successfully' };
  }

  /**
   * Format task response
   */
  formatTask(task) {
    return {
      id: task.id,
      projectId: task.project_id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.due_date,
      estimatedHours: task.estimated_hours,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      project: task.Project ? {
        id: task.Project.id,
        name: task.Project.name
      } : null,
    };
  }
}

module.exports = new TaskService();
