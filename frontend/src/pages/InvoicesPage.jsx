import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PlusIcon } from '@heroicons/react/24/outline';
import Button from '../components/Common/Button';
import Modal from '../components/Common/Modal';
import Select from '../components/Common/Select';
import InvoiceForm from '../components/Forms/InvoiceForm';
import InvoiceTable from '../components/Tables/InvoiceTable';
import { fetchInvoices, setFilters } from '../store/invoicesSlice';
import { fetchClients } from '../store/clientsSlice';

function InvoicesPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { items: invoices, filters, loading } = useSelector((state) => state.invoices);
  const { items: clients } = useSelector((state) => state.clients);

  useEffect(() => {
    dispatch(fetchInvoices());
    dispatch(fetchClients());
  }, [dispatch]);

  const statusOptions = [
    { value: 'all', label: t('allStatuses') },
    { value: 'paid', label: t('paid') },
    { value: 'unpaid', label: t('unpaid') },
    { value: 'overdue', label: t('overdue') },
  ];

  const clientOptions = [
    { value: '', label: t('allClients') },
    ...clients.map((client) => ({
      value: client.id.toString(),
      label: client.name,
    })),
  ];

  const filteredInvoices = invoices.filter((invoice) => {
    if (filters.status !== 'all' && invoice.status !== filters.status) {
      return false;
    }
    if (filters.clientId && invoice.clientId !== parseInt(filters.clientId)) {
      return false;
    }
    return true;
  });

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const paidAmount = filteredInvoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);
  const unpaidAmount = filteredInvoices
    .filter((inv) => inv.status === 'unpaid')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  return (
    <div className="page-container">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('invoices')}</h1>
          <p className="mt-2 text-muted-foreground">{t('manageInvoices')}</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="h-5 w-5 mr-2" />
          {t('newInvoice')}
        </Button>
      </div>

      {/* Stats */}
      <div className="stats-grid mb-8">
        <div className="card">
          <p className="text-sm text-muted-foreground">{t('total')} {t('invoices')}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{filteredInvoices.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-muted-foreground">{t('total')} {t('amount')}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">${totalAmount.toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-muted-foreground">{t('paid')}</p>
          <p className="mt-1 text-2xl font-semibold text-green-600">${paidAmount.toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-muted-foreground">{t('unpaid')}</p>
          <p className="mt-1 text-2xl font-semibold text-yellow-600">${unpaidAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="filter-grid">
          <Select
            label={t('status')}
            value={filters.status}
            onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
            options={statusOptions}
          />
          <Select
            label={t('client')}
            value={filters.clientId || ''}
            onChange={(e) => dispatch(setFilters({ clientId: e.target.value }))}
            options={clientOptions}
          />
          <div className="flex items-end">
            <Button
              variant="ghost"
              onClick={() => dispatch(setFilters({ status: 'all', clientId: null }))}
              className="w-full"
            >
              {t('clearFilters')}
            </Button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card">
        <InvoiceTable invoices={filteredInvoices} />
      </div>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Invoice"
        size="xl"
      >
        <InvoiceForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default InvoicesPage;
