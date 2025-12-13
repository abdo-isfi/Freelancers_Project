const { Invoice, InvoiceItem, Project, Client } = require('../models');

class InvoiceService {
  /**
   * Get all invoices for a user
   */
  async getInvoices(userId, { page = 1, limit = 10, status = null } = {}) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;
    const where = { user_id: userId };

    if (status) {
      where.status = status;
    }

    const { count, rows } = await Invoice.findAndCountAll({
      where,
      include: [
        { model: InvoiceItem, separate: true },
        { model: Client }
      ],
      offset,
      limit: limitNum,
      order: [['created_at', 'DESC']],
    });

    return {
      data: rows.map(this.formatInvoice),
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit),
      },
    };
  }

  /**
   * Get invoice by ID
   */
  async getInvoiceById(invoiceId, userId) {
    const invoice = await Invoice.findOne({
      where: { id: invoiceId, user_id: userId },
      include: [
        { model: InvoiceItem },
        { model: Client }
      ],
    });

    if (!invoice) {
      const error = new Error('Invoice not found');
      error.status = 404;
      throw error;
    }

    return this.formatInvoice(invoice);
  }

  /**
   * Create new invoice
   */
  async createInvoice(userId, {
    projectId,
    clientId,
    invoiceNumber,
    issueDate,
    dueDate,
    items,
    notes,
    currency,
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

    // Verify client belongs to user
    const client = await Client.findOne({
      where: { id: clientId, user_id: userId },
    });

    if (!client) {
      const error = new Error('Client not found');
      error.status = 404;
      throw error;
    }

    // Check if invoice number is unique
    const existingInvoice = await Invoice.findOne({
      where: { number: invoiceNumber, user_id: userId },
    });

    if (existingInvoice) {
      const error = new Error('Invoice number already exists');
      error.status = 400; // Bad Request
      throw error;
    }



    // Calculate totals
    let subtotal = 0;
    items.forEach((item) => {
      subtotal += item.quantity * item.unitPrice;
    });

    const taxAmount = 0; // Can be configured
    const totalAmount = subtotal + taxAmount;

    // Create invoice
    // Create invoice
    const invoice = await Invoice.create({
      user_id: userId,
      client_id: clientId,
      number: invoiceNumber,
      issue_date: issueDate,
      due_date: dueDate,
      status: 'draft',
      total_ht: subtotal,
      total_tva: taxAmount,
      total_ttc: totalAmount,
      currency: currency || 'EUR',
      // notes is not in the model definition I saw, let's allow sequelize to ignore if extra or check model again?
      // Model didn't show notes field!
    });

    // Create invoice items
    const createdItems = await Promise.all(
      items.map((item) =>
        InvoiceItem.create({
          invoice_id: invoice.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total: item.quantity * item.unitPrice,
          project_id: projectId, // Assuming items belong to the project selected for invoice?
        })
      )
    );

    // Reload invoice with associations
    const fullInvoice = await Invoice.findOne({
      where: { id: invoice.id },
      include: [
        { model: InvoiceItem },
        { model: Client }
      ],
    });

    return this.formatInvoice(fullInvoice);
  }

  /**
   * Update invoice
   */
  async updateInvoice(invoiceId, userId, updates) {
    const invoice = await Invoice.findOne({
      where: { id: invoiceId, user_id: userId },
    });

    if (!invoice) {
      const error = new Error('Invoice not found');
      error.status = 404;
      throw error;
    }

    if (invoice.status !== 'draft') {
      const error = new Error('Can only update draft invoices');
      error.status = 400;
      throw error;
    }

    const mappedUpdates = {
      status: updates.status,
      notes: updates.notes,
    };

    Object.keys(mappedUpdates).forEach((key) => {
      if (mappedUpdates[key] !== undefined) {
        invoice[key] = mappedUpdates[key];
      }
    });

    await invoice.save();

    return this.formatInvoice(invoice);
  }

  /**
   * Mark invoice as paid
   */
  async markInvoiceAsPaid(invoiceId, userId, paidDate = null) {
    const invoice = await Invoice.findOne({
      where: { id: invoiceId, user_id: userId },
    });

    if (!invoice) {
      const error = new Error('Invoice not found');
      error.status = 404;
      throw error;
    }

    invoice.status = 'paid';
    invoice.paid_date = paidDate || new Date();

    await invoice.save();

    return this.formatInvoice(invoice);
  }

  /**
   * Delete invoice
   */
  async deleteInvoice(invoiceId, userId) {
    const invoice = await Invoice.findOne({
      where: { id: invoiceId, user_id: userId },
    });

    if (!invoice) {
      const error = new Error('Invoice not found');
      error.status = 404;
      throw error;
    }

    await invoice.destroy();

    return { message: 'Invoice deleted successfully' };
  }

  /**
   * Format invoice response
   */
  formatInvoice(invoice) {
    return {
      id: invoice.id,
      // projectId is not on the invoice model directly
      clientId: invoice.client_id,
      client: invoice.Client ? {
        id: invoice.Client.id,
        name: invoice.Client.name,
      } : null,
      invoiceNumber: invoice.number,
      issueDate: invoice.issue_date,
      dueDate: invoice.due_date,
      status: invoice.status,
      subtotal: parseFloat(invoice.total_ht || 0),
      taxAmount: parseFloat(invoice.total_tva || 0),
      totalAmount: parseFloat(invoice.total_ttc || 0),
      currency: invoice.currency,
      items: invoice.InvoiceItems ? invoice.InvoiceItems.map((item) => ({
        id: item.id,
        description: item.description,
        quantity: parseFloat(item.quantity),
        unitPrice: parseFloat(item.unit_price),
        total: parseFloat(item.total),
      })) : [],
      createdAt: invoice.created_at,
      updatedAt: invoice.updated_at,
    };
  }
}

module.exports = new InvoiceService();
