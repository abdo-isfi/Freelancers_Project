const { TimeEntry, Project, Task } = require('../models');

class TimeEntryService {
  /**
   * Get all time entries for a user
   */
  async getTimeEntries(userId, { page = 1, limit = 10, projectId = null } = {}) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;
    const where = { user_id: userId };

    if (projectId) {
      where.project_id = projectId;
    }

    const { count, rows } = await TimeEntry.findAndCountAll({
      where,
      include: [
        { model: Project, attributes: ['id', 'name'] },
        { model: Task, attributes: ['id', 'title'] },
      ],
      offset,
      limit: limitNum,
      order: [['start_time', 'DESC']],
    });

    return {
      data: rows.map(this.formatTimeEntry),
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit),
      },
    };
  }

  /**
   * Create time entry
   */
  async createTimeEntry(userId, {
    projectId,
    taskId,
    startTime,
    endTime,
    description,
    isBillable,
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

    // Calculate duration if both start and end times are provided
    let durationMinutes = null;
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      durationMinutes = Math.round((end - start) / (1000 * 60));
    }

    const timeEntry = await TimeEntry.create({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      date: startTime ? new Date(startTime) : new Date(),
      start_time: startTime,
      end_time: endTime,
      duration_minutes: durationMinutes,
      description,
      is_billable: isBillable !== undefined ? isBillable : true,
    });

    return this.formatTimeEntry(timeEntry);
  }

  /**
   * Update time entry
   */
  async updateTimeEntry(entryId, userId, updates) {
    const entry = await TimeEntry.findOne({
      where: { id: entryId, user_id: userId },
    });

    if (!entry) {
      const error = new Error('Time entry not found');
      error.status = 404;
      throw error;
    }

    if (updates.startTime) entry.start_time = updates.startTime;
    if (updates.endTime) entry.end_time = updates.endTime;
    if (updates.description) entry.description = updates.description;
    if (updates.isBillable !== undefined) entry.is_billable = updates.isBillable;

    // Recalculate duration
    if (entry.start_time && entry.end_time) {
      const start = new Date(entry.start_time);
      const end = new Date(entry.end_time);
      entry.duration_minutes = Math.round((end - start) / (1000 * 60));
    }

    await entry.save();

    return this.formatTimeEntry(entry);
  }

  /**
   * Delete time entry
   */
  async deleteTimeEntry(entryId, userId) {
    const entry = await TimeEntry.findOne({
      where: { id: entryId, user_id: userId },
    });

    if (!entry) {
      const error = new Error('Time entry not found');
      error.status = 404;
      throw error;
    }

    await entry.destroy();

    return { message: 'Time entry deleted successfully' };
  }

  /**
   * Start time tracking (create entry without end time)
   */
  async startTracking(userId, { projectId, taskId, description }) {
    // Verify project belongs to user
    const project = await Project.findOne({
      where: { id: projectId, user_id: userId },
    });

    if (!project) {
      const error = new Error('Project not found');
      error.status = 404;
      throw error;
    }

    // Check if there's already an active entry
    const activeEntry = await TimeEntry.findOne({
      where: {
        user_id: userId,
        end_time: null,
      },
    });

    if (activeEntry) {
      const error = new Error('There is already an active time entry');
      error.status = 409;
      throw error;
    }

    const now = new Date();
    const entry = await TimeEntry.create({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      date: now,
      start_time: now,
      description,
      is_billable: true,
    });

    return this.formatTimeEntry(entry);
  }

  /**
   * Stop time tracking
   */
  async stopTracking(entryId, userId) {
    const entry = await TimeEntry.findOne({
      where: { id: entryId, user_id: userId },
    });

    if (!entry) {
      const error = new Error('Time entry not found');
      error.status = 404;
      throw error;
    }

    if (entry.end_time) {
      const error = new Error('This time entry is already stopped');
      error.status = 400;
      throw error;
    }

    entry.end_time = new Date();
    const start = new Date(entry.start_time);
    const end = entry.end_time;
    entry.duration_minutes = Math.round((end - start) / (1000 * 60));

    await entry.save();

    return this.formatTimeEntry(entry);
  }

  /**
   * Format time entry response
   */
  formatTimeEntry(entry) {
    return {
      id: entry.id,
      projectId: entry.project_id,
      project: entry.Project ? {
        id: entry.Project.id,
        name: entry.Project.name,
      } : null,
      taskId: entry.task_id,
      task: entry.Task ? {
        id: entry.Task.id,
        title: entry.Task.title,
      } : null,
      date: entry.date,
      startTime: entry.start_time,
      endTime: entry.end_time,
      durationMinutes: entry.duration_minutes,
      description: entry.description,
      isBillable: entry.is_billable,
      createdAt: entry.created_at,
      updatedAt: entry.updated_at,
    };
  }
}

module.exports = new TimeEntryService();
