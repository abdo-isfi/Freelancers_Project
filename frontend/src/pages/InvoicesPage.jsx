import { useState } from 'react';
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Button from '../components/Common/Button';
import EmptyState from '../components/Common/EmptyState';

function InvoicesPage() {
  const [invoices] = useState([]);

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="mt-2 text-gray-600">Create and manage client invoices</p>
        </div>
        <Button variant="primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          New Invoice
        </Button>
      </div>

      <div className="card">
        <EmptyState
          icon={DocumentTextIcon}
          title="No invoices yet"
          description="Create your first invoice to start billing clients."
          action={
            <Button variant="primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Your First Invoice
            </Button>
          }
        />
      </div>
    </div>
  );
}

export default InvoicesPage;
