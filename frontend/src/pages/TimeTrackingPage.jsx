import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PlusIcon } from '@heroicons/react/24/outline';
import Button from '../components/Common/Button';
import Modal from '../components/Common/Modal';
import TimerWidget from '../components/Widgets/TimerWidget';
import TimeEntryForm from '../components/Forms/TimeEntryForm';
import TimeEntryTable from '../components/Tables/TimeEntryTable';
import Select from '../components/Common/Select';
import { fetchTimeEntries } from '../store/timeEntriesSlice';
import { fetchProjects } from '../store/projectsSlice';
import { fetchTasks } from '../store/tasksSlice';
import { AnimatedText } from '../components/ui/animated-shiny-text';

function TimeTrackingPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterProject, setFilterProject] = useState('');

  const { items: timeEntries, loading } = useSelector((state) => state.timeEntries);
  const { items: projects } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchTimeEntries());
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  const projectOptions = [
    { value: '', label: t('allProjects') || 'All Projects' },
    ...projects.map((project) => ({
      value: project.id.toString(),
      label: project.name,
    })),
  ];

  const filteredEntries = filterProject
    ? timeEntries.filter((entry) => entry.projectId === parseInt(filterProject))
    : timeEntries;

  const totalHours = filteredEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);

  return (
    <div className="page-container">
      <div className="mb-[5px] mt-8 flex flex-col gap-4">
        <div className="text-center w-full">
          <AnimatedText 
            text={t('timeTracking')} 
            textClassName="text-5xl font-bold text-foreground"
            className="justify-center py-2"
          />
          <p className="mt-2 text-muted-foreground">{t('trackYourTime')}</p>
        </div>
        <div className="w-full flex justify-end">
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('addTimeEntry')}
          </Button>
        </div>
      </div>

      {/* Timer Widget */}
      <div className="mb-6">
        <TimerWidget />
      </div>

      {/* Stats */}
      <div className="stats-grid mb-6">
        <div className="card">
          <p className="text-sm text-muted-foreground">{t('total')} Entries</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{filteredEntries.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-muted-foreground">{t('total')} {t('hours')}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{totalHours.toFixed(1)}h</p>
        </div>
        <div className="card">
          <p className="text-sm text-muted-foreground">{t('thisWeek')}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {timeEntries
              .filter((entry) => {
                const entryDate = new Date(entry.date);
                const weekStart = new Date();
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                weekStart.setHours(0, 0, 0, 0);
                return entryDate >= weekStart;
              })
              .reduce((sum, entry) => sum + (entry.duration || 0), 0)
              .toFixed(1)}
            h
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-muted-foreground">{t('averagePerDay')}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {filteredEntries.length > 0 ? (totalHours / 7).toFixed(1) : '0.0'}h
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Select
              label={t('filterByProject')}
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              options={projectOptions}
            />
          </div>
          {filterProject && (
            <Button variant="ghost" onClick={() => setFilterProject('')} className="mt-7">
              {t('clearFilters')}
            </Button>
          )}
        </div>
      </div>

      {/* Time Entries Table */}
      <div className="card">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t('timeEntries')}</h2>
        <TimeEntryTable entries={filteredEntries} />
      </div>

      {/* Manual Entry Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Manual Time Entry"
        size="lg"
      >
        <TimeEntryForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default TimeTrackingPage;
