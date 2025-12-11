import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as invoicesAPI from '../api/invoicesAPI';

// Async thunks
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await invoicesAPI.getInvoices(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch invoices' });
    }
  }
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchInvoiceById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await invoicesAPI.getInvoiceById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/createInvoice',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await invoicesAPI.createInvoice(invoiceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateInvoice = createAsyncThunk(
  'invoices/updateInvoice',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await invoicesAPI.updateInvoice(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoices/deleteInvoice',
  async (id, { rejectWithValue }) => {
    try {
      await invoicesAPI.deleteInvoice(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const markInvoiceAsPaid = createAsyncThunk(
  'invoices/markAsPaid',
  async (id, { rejectWithValue }) => {
    try {
      const response = await invoicesAPI.markAsPaid(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const downloadInvoice = createAsyncThunk(
  'invoices/downloadInvoice',
  async (id, { rejectWithValue }) => {
    try {
      const response = await invoicesAPI.downloadInvoice(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Initial state
const initialState = {
  items: [],
  currentInvoice: null,
  pagination: {
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 0,
  },
  filters: {
    status: 'all', // all, paid, unpaid, overdue
    clientId: null,
    dateFrom: null,
    dateTo: null,
  },
  loading: false,
  error: null,
};

// Invoices slice
const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentInvoice: (state, action) => {
      state.currentInvoice = action.payload;
    },
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch invoices
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        // API returns { success: true, data: { data: [], pagination: {} } }
        const responseData = action.payload.data || action.payload;
        state.items = responseData.data || responseData.items || [];
        state.pagination = responseData.pagination || state.pagination;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch invoices';
      });

    // Fetch invoice by ID
    builder
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch invoice';
      });

    // Create invoice
    builder
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create invoice';
      });

    // Update invoice
    builder
      .addCase(updateInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentInvoice?.id === action.payload.id) {
          state.currentInvoice = action.payload;
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update invoice';
      });

    // Delete invoice
    builder
      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(i => i.id !== action.payload);
        if (state.currentInvoice?.id === action.payload) {
          state.currentInvoice = null;
        }
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete invoice';
      });

    // Mark as paid
    builder
      .addCase(markInvoiceAsPaid.pending, (state) => {
        state.loading = true;
      })
      .addCase(markInvoiceAsPaid.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentInvoice?.id === action.payload.id) {
          state.currentInvoice = action.payload;
        }
      })
      .addCase(markInvoiceAsPaid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to mark invoice as paid';
      });

    // Download invoice
    builder
      .addCase(downloadInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadInvoice.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to download invoice';
      });
  },
});

export const { clearError, setFilters, clearFilters, setCurrentInvoice, clearCurrentInvoice } = invoicesSlice.actions;
export default invoicesSlice.reducer;
