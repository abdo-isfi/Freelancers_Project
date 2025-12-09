import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  EyeIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import EmptyState from '../Common/EmptyState';
import { deleteInvoice, markInvoiceAsPaid, downloadInvoice } from '../../store/invoicesSlice';
import { showSuccess, showError } from '../../utils/toast';

function InvoiceTable({ invoices = [] }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: clients } = useSelector((state) => state.clients);

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  const handleMarkAsPaid = async (id, e) => {
    e.stopPropagation();
    try {
      await dispatch(markInvoiceAsPaid(id)).unwrap();
      showSuccess('Invoice marked as paid');
    } catch (error) {
      showError('Failed to mark invoice as paid');
    }
  };

  const handleDownload = async (id, e) => {
    e.stopPropagation();
    try {
      await dispatch(downloadInvoice(id)).unwrap();
      showSuccess('Invoice downloaded');
    } catch (error) {
      showError('Failed to download invoice');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await dispatch(deleteInvoice(id)).unwrap();
        showSuccess('Invoice deleted');
      } catch (error) {
        showError('Failed to delete invoice');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      paid: 'bg-green-100 text-green-800',
      unpaid: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
    };
    return badges[status] || badges.unpaid;
  };

  if (invoices.length === 0) {
    return (
      <EmptyState
        icon={DocumentTextIcon}
        title="No invoices yet"
        description="Create your first invoice to start billing clients."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
              Invoice #
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
              Client
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
              Due Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {invoices.map((invoice) => (
            <tr
              key={invoice.id}
              className="hover:bg-muted/50 cursor-pointer"
              onClick={() => navigate(`/invoices/${invoice.id}`)}
            >
              <td className="px-4 py-3 text-sm text-foreground font-medium">
                {invoice.invoiceNumber}
              </td>
              <td className="px-4 py-3 text-sm text-foreground">
                {getClientName(invoice.clientId)}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {new Date(invoice.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-4 py-3 text-sm text-foreground font-medium">
                ${invoice.total?.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(invoice.status)}`}>
                  {invoice.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/invoices/${invoice.id}`);
                    }}
                    className="text-primary hover:text-primary/80 transition-colors"
                    title="View"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => handleDownload(invoice.id, e)}
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                    title="Download"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                  {invoice.status !== 'paid' && (
                    <button
                      onClick={(e) => handleMarkAsPaid(invoice.id, e)}
                      className="text-green-500 hover:text-green-600 transition-colors"
                      title="Mark as Paid"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDelete(invoice.id, e)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceTable;
