import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import EmptyState from '../components/Common/EmptyState';
import { fetchClients, deleteClient } from '../store/clientsSlice';
import { fetchProjects } from '../store/projectsSlice';
import { fetchInvoices } from '../store/invoicesSlice';
import { AnimatedText } from '../components/ui/animated-shiny-text';

function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('info');

  const { items: clients, loading: clientsLoading, error: clientsError } = useSelector((state) => state.clients);
  const { items: projects, loading: projectsLoading } = useSelector((state) => state.projects);
  const { items: invoices, loading: invoicesLoading } = useSelector((state) => state.invoices);

  const client = clients.find((c) => c.id === parseInt(id));

  useEffect(() => {
    if (!client) {
      dispatch(fetchClients());
    }
    dispatch(fetchProjects({ clientId: id }));
    dispatch(fetchInvoices({ clientId: id }));
  }, [dispatch, id, client]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      await dispatch(deleteClient(id));
      navigate('/clients');
    }
  };

  if (clientsLoading && !client) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (clientsError) {
    return (
      <div className="p-6">
        <ErrorMessage message={clientsError} />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6">
        <ErrorMessage message="Client not found" />
        <Button onClick={() => navigate('/clients')} className="mt-4">
          Back to Clients
        </Button>
      </div>
    );
  }

  const clientProjects = projects.filter((p) => p.clientId === parseInt(id));
  const clientInvoices = invoices.filter((i) => i.clientId === parseInt(id));

  const tabs = [
    { id: 'info', label: 'Information' },
    { id: 'projects', label: `Projects (${clientProjects.length})` },
    { id: 'invoices', label: `Invoices (${clientInvoices.length})` },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/clients')}
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Clients
          </Button>

          <div className="flex gap-2">
            <Button variant="secondary">
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <TrashIcon className="h-5 w-5 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="text-center">
          <AnimatedText 
            text={client.name} 
            textClassName="text-5xl font-bold text-foreground"
            className="justify-center py-2"
          />
          <p className="mt-2 text-muted-foreground">{client.company}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-foreground mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-muted-foreground mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-foreground">{client.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-muted-foreground mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-foreground">{client.phone || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 text-muted-foreground mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="text-foreground">{client.company || 'N/A'}</p>
              </div>
            </div>
            {client.address && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <p className="text-foreground">{client.address}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="card">
          {projectsLoading ? (
            <LoadingSpinner />
          ) : clientProjects.length > 0 ? (
            <div className="space-y-3">
              {clientProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 border border-border rounded-lg hover:border-primary cursor-pointer transition-colors"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-foreground">{project.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : project.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No projects yet"
              description="This client doesn't have any projects."
            />
          )}
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="card">
          {invoicesLoading ? (
            <LoadingSpinner />
          ) : clientInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Invoice #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {clientInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                    >
                      <td className="px-4 py-3 text-sm text-foreground">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground font-medium">
                        ${invoice.total?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : invoice.status === 'overdue'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No invoices yet"
              description="This client doesn't have any invoices."
            />
          )}
        </div>
      )}
    </div>
  );
}

export default ClientDetailPage;
