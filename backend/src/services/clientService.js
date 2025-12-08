const { Client } = require('../models');

class ClientService {
  /**
   * Get all clients for a user with pagination
   */
  async getAllClients(userId, { page = 1, limit = 10, search = '' } = {}) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Client.findAndCountAll({
      where: { user_id: userId },
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    return {
      data: rows.map(this.formatClient),
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit),
      },
    };
  }

  /**
   * Get client by ID
   */
  async getClientById(clientId, userId) {
    const client = await Client.findOne({
      where: { id: clientId, user_id: userId },
    });

    if (!client) {
      const error = new Error('Client not found');
      error.status = 404;
      throw error;
    }

    return this.formatClient(client);
  }

  /**
   * Create new client
   */
  async createClient(userId, {
    name,
    email,
    phone,
    companyName,
    address,
    taxId,
    currency,
  }) {
    const client = await Client.create({
      user_id: userId,
      name,
      email,
      phone,
      company_name: companyName,
      address,
      tax_id: taxId,
      currency: currency || 'EUR',
      is_active: true,
    });

    return this.formatClient(client);
  }

  /**
   * Update client
   */
  async updateClient(clientId, userId, updates) {
    const client = await Client.findOne({
      where: { id: clientId, user_id: userId },
    });

    if (!client) {
      const error = new Error('Client not found');
      error.status = 404;
      throw error;
    }

    const mappedUpdates = {
      name: updates.name,
      email: updates.email,
      phone: updates.phone,
      company_name: updates.companyName,
      address: updates.address,
      tax_id: updates.taxId,
      currency: updates.currency,
      is_active: updates.isActive !== undefined ? updates.isActive : client.is_active,
    };

    Object.keys(mappedUpdates).forEach((key) => {
      if (mappedUpdates[key] !== undefined) {
        client[key] = mappedUpdates[key];
      }
    });

    await client.save();

    return this.formatClient(client);
  }

  /**
   * Delete client
   */
  async deleteClient(clientId, userId) {
    const client = await Client.findOne({
      where: { id: clientId, user_id: userId },
    });

    if (!client) {
      const error = new Error('Client not found');
      error.status = 404;
      throw error;
    }

    await client.destroy();

    return { message: 'Client deleted successfully' };
  }

  /**
   * Format client response
   */
  formatClient(client) {
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      companyName: client.company_name,
      address: client.address,
      taxId: client.tax_id,
      currency: client.currency,
      isActive: client.is_active,
      createdAt: client.created_at,
      updatedAt: client.updated_at,
    };
  }
}

module.exports = new ClientService();
