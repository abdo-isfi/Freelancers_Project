import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import EmptyState from '../components/Common/EmptyState';
import { fetchProjects, deleteProject } from '../store/projectsSlice';
import { fetchTasks } from '../store/tasksSlice';
import { fetchTimeEntries } from '../store/timeEntriesSlice';
import { fetchInvoices } from '../store/invoicesSlice';

function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('overview');

  const { items: projects, loading: projectsLoading, error: projectsError } = useSelector((state) => state.projects);
  const { items: tasks, loading: tasksLoading } = useSelector((state) => state.tasks);
  const { items: timeEntries, loading: timeEntriesLoading } = useSelector((state) => state.timeEntries);
  const { items: invoices, loading: invoicesLoading } = useSelector((state) => state.invoices);

  const project = projects.find((p) => p.id === parseInt(id));

  useEffect(() => {
    if (!project) {
      dispatch(fetchProjects());
    }
    dispatch(fetchTasks({ projectId: id }));
    dispatch(fetchTimeEntries({ projectId: id }));
    dispatch(fetchInvoices({ projectId: id }));
  }, [dispatch, id, project]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await dispatch(deleteProject(id));
      navigate('/projects');
    }
  };

  if (projectsLoading && !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (projectsError) {
    return (
      <div className="p-6">
        <ErrorMessage message={projectsError} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <ErrorMessage message="Project not found" />
        <Button onClick={() => navigate('/projects')} className="mt-4">
          Back to Projects
        </Button>
      </div>
    );
  }

  const projectTasks = tasks.filter((t) => t.projectId === parseInt(id));
  const projectTimeEntries = timeEntries.filter((te) => te.projectId === parseInt(id));
  const projectInvoices = invoices.filter((i) => i.projectId === parseInt(id));

  const completedTasks = projectTasks.filter((t) => t.status === 'completed').length;
  const totalHours = projectTimeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: `Tasks (${projectTasks.length})` },
    { id: 'time', label: `Time Entries (${projectTimeEntries.length})` },
    { id: 'invoices', label: `Invoices (${projectInvoices.length})` },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/projects')}
          className="mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Projects
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
            <p className="mt-2 text-muted-foreground">{project.description}</p>
          </div>
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
      </div>

      {/* Stats */}
      <div className="stats-grid mb-6">
        <div className="card">
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="mt-1 text-lg font-semibold text-foreground capitalize">{project.status}</p>
        </div>
        <div className="card">
          <p className="text-sm text-muted-foreground">Tasks Completed</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {completedTasks} / {projectTasks.length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-muted-foreground">Total Hours</p>
          <p className="mt-1 text-lg font-semibold text-foreground">{totalHours.toFixed(1)}h</p>
        </div>
        <div className="card">
          <p className="text-sm text-muted-foreground">Budget</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            ${project.budget?.toFixed(2) || '0.00'}
          </p>
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
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-foreground mb-4">Project Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-foreground">{project.description || 'No description'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="text-foreground">
                  {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="text-foreground">
                  {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="card">
            <h2 className="text-lg font-semibold text-foreground mb-4">Progress</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tasks Completion</span>
                <span className="text-foreground font-medium">
                  {projectTasks.length > 0
                    ? Math.round((completedTasks / projectTasks.length) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      projectTasks.length > 0
                        ? (completedTasks / projectTasks.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="card">
          {tasksLoading ? (
            <LoadingSpinner />
          ) : projectTasks.length > 0 ? (
            <div className="space-y-3">
              {projectTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border border-border rounded-lg hover:border-primary cursor-pointer transition-colors"
                  onClick={() => navigate(`/tasks`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      {task.status === 'completed' ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <div className="h-5 w-5 border-2 border-muted-foreground rounded-full mt-0.5" />
                      )}
                      <div>
                        <h3 className="font-semibold text-foreground">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No tasks yet"
              description="This project doesn't have any tasks."
            />
          )}
        </div>
      )}

      {activeTab === 'time' && (
        <div className="card">
          {timeEntriesLoading ? (
            <LoadingSpinner />
          ) : projectTimeEntries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {projectTimeEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm text-foreground">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {entry.description || 'No description'}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground font-medium">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                          {entry.duration?.toFixed(1)}h
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No time entries yet"
              description="No time has been tracked for this project."
            />
          )}
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="card">
          {invoicesLoading ? (
            <LoadingSpinner />
          ) : projectInvoices.length > 0 ? (
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
                  {projectInvoices.map((invoice) => (
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
              description="This project doesn't have any invoices."
            />
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectDetailPage;
