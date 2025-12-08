const invoiceService = require('../services/invoiceService');

/**
 * Get all invoices
 */
const getInvoices = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page, limit, status } = req.query;

    const result = await invoiceService.getInvoices(userId, { page, limit, status });

    res.status(200).json({
      success: true,
      message: 'Invoices retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get invoice by ID
 */
const getInvoiceById = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const invoice = await invoiceService.getInvoiceById(id, userId);

    res.status(200).json({
      success: true,
      message: 'Invoice retrieved successfully',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create invoice
 */
const createInvoice = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      projectId,
      clientId,
      invoiceNumber,
      issueDate,
      dueDate,
      items,
      notes,
      currency,
    } = req.body;

    const invoice = await invoiceService.createInvoice(userId, {
      projectId,
      clientId,
      invoiceNumber,
      issueDate,
      dueDate,
      items,
      notes,
      currency,
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update invoice
 */
const updateInvoice = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const updates = req.body;

    const invoice = await invoiceService.updateInvoice(id, userId, updates);

    res.status(200).json({
      success: true,
      message: 'Invoice updated successfully',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark invoice as paid
 */
const markInvoicePaid = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { paidDate } = req.body;

    const invoice = await invoiceService.markInvoiceAsPaid(id, userId, paidDate);

    res.status(200).json({
      success: true,
      message: 'Invoice marked as paid',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Download invoice (placeholder)
 */
const downloadInvoice = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const invoice = await invoiceService.getInvoiceById(id, userId);

    // TODO: Implement PDF generation (use pdfkit or similar)
    res.status(200).json({
      success: true,
      message: 'Invoice PDF generation not yet implemented',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete invoice
 */
const deleteInvoice = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    await invoiceService.deleteInvoice(id, userId);

    res.status(200).json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  markInvoicePaid,
  downloadInvoice,
  deleteInvoice,
};
