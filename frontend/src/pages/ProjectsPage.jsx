import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchProjects, deleteProject } from '../store/projectsSlice';
import { PlusIcon, PencilIcon, TrashIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import Button from '../components/Common/Button';
import EmptyState from '../components/Common/EmptyState';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Pagination from '../components/Common/Pagination';
import ProjectFormModal from '../components/Forms/ProjectFormModal';
import { formatDate } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';
import { AnimatedText } from '../components/ui/animated-shiny-text';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  on_hold: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  active: 'Active',
  on_hold: 'On Hold',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function ProjectsPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items: projects, loading, pagination } = useSelector((state) => state.projects);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects({ page: currentPage, limit: 20 }));
  }, [dispatch, currentPage]);

  const handleAddProject = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await dispatch(deleteProject(id)).unwrap();
        toast.success('Project deleted successfully');
        dispatch(fetchProjects({ page: currentPage, limit: 20 }));
      } catch (error) {
        toast.error(error.message || 'Failed to delete project');
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading && projects.length === 0) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" className="py-12" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-[5px] mt-8 flex flex-col gap-4">
        <div className="text-center w-full">
          <AnimatedText 
            text={t('projects')} 
            textClassName="text-5xl font-bold text-foreground"
            className="justify-center py-2"
          />
          <p className="mt-2 text-muted-foreground">{t('manageClientProjects')}</p>
        </div>
        <div className="w-full flex justify-end">
          <Button variant="primary" onClick={handleAddProject}>
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('addProject')}
          </Button>
        </div>
      </div>

      {/* Content */}
      {projects.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={BriefcaseIcon}
            title={t('noProjectsYet')}
            description={t('getStartedFirstProject')}
            action={
              <Button variant="primary" onClick={handleAddProject}>
                <PlusIcon className="h-5 w-5 mr-2" />
                {t('createFirstProject')}
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <div className="card overflow-hidden p-0">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('projectName')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('client')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('budget')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('date')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-accent/50">
                    <td className="px-6 py-4 text-left">
                      <div className="text-sm font-medium text-foreground">
                        {project.name}
                      </div>
                      {project.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {project.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">
                      <div className="text-sm text-muted-foreground">
                        {project.Client?.name || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[project.status]}`}>
                        {statusLabels[project.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">
                      <div className="text-sm text-muted-foreground">
                        {project.budget ? formatCurrency(project.budget) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">
                      <div className="text-sm text-muted-foreground">
                        {project.startDate ? formatDate(project.startDate) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              className="mt-4"
            />
          )}
        </>
      )}

      {/* Project Form Modal */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </div>
  );
}

export default ProjectsPage;
