import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PlayIcon, PauseIcon, StopIcon } from '@heroicons/react/24/solid';
import Button from '../Common/Button';
import Select from '../Common/Select';
import { startTimer, stopTimer, setActiveTimer, updateTimerDuration } from '../../store/timeEntriesSlice';
import { showSuccess, showError } from '../../utils/toast';

function TimerWidget() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeTimer } = useSelector((state) => state.timeEntries);
  const { items: projects } = useSelector((state) => state.projects);

  const [selectedProject, setSelectedProject] = useState('');
  const [description, setDescription] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef(null);

  // Load timer from localStorage on mount
  useEffect(() => {
    const savedTimer = localStorage.getItem('activeTimer');
    if (savedTimer) {
      const timer = JSON.parse(savedTimer);
      dispatch(setActiveTimer(timer));
      setSelectedProject(timer.projectId);
      setDescription(timer.description || '');
      setDuration(timer.duration || 0);
      setIsRunning(timer.isRunning || false);
    }
  }, [dispatch]);

  // Save timer to localStorage whenever it changes
  useEffect(() => {
    if (activeTimer) {
      localStorage.setItem('activeTimer', JSON.stringify({
        ...activeTimer,
        duration,
        isRunning,
      }));
    } else {
      localStorage.removeItem('activeTimer');
    }
  }, [activeTimer, duration, isRunning]);

  // Timer interval
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          dispatch(updateTimerDuration(newDuration));
          return newDuration;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, dispatch]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStart = async () => {
    if (!selectedProject) {
      showError('Please select a project');
      return;
    }

    try {
      const timerData = {
        projectId: parseInt(selectedProject),
        description,
        startTime: new Date().toISOString(),
      };

      const result = await dispatch(startTimer(timerData)).unwrap();
      setIsRunning(true);
      setDuration(0);
      showSuccess('Timer started');
    } catch (error) {
      showError('Failed to start timer');
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    showSuccess('Timer paused');
  };

  const handleResume = () => {
    setIsRunning(true);
    showSuccess('Timer resumed');
  };

  const handleStop = async () => {
    if (!activeTimer) return;

    try {
      await dispatch(stopTimer(activeTimer.id)).unwrap();
      setIsRunning(false);
      setDuration(0);
      setSelectedProject('');
      setDescription('');
      showSuccess('Time entry saved');
    } catch (error) {
      showError('Failed to stop timer');
    }
  };

  const projectOptions = projects.map((project) => ({
    value: project.id.toString(),
    label: project.name,
  }));

  return (
    <div className="card">
      <div className="text-center mb-6">
        <h2 className="text-6xl font-bold text-foreground mb-2 font-mono">
          {formatTime(duration)}
        </h2>
        <p className="text-muted-foreground">
          {isRunning ? 'Timer running...' : activeTimer ? 'Timer paused' : t('noActiveTimer')}
        </p>
      </div>

      {!activeTimer ? (
        <div className="space-y-4">
          <Select
            label={t('project')}
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            options={projectOptions}
            placeholder={t('selectProject')}
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('descriptionOptional')}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('whatAreYouWorkingOn')}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button variant="primary" size="lg" onClick={handleStart} className="w-full">
            <PlayIcon className="h-6 w-6 mr-2" />
            {t('startTimer')}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Project</p>
            <p className="text-foreground font-medium">
              {projects.find((p) => p.id === parseInt(selectedProject))?.name || 'Unknown'}
            </p>
          </div>
          {description && (
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-foreground">{description}</p>
            </div>
          )}
          <div className="flex gap-3">
            {isRunning ? (
              <Button variant="secondary" size="lg" onClick={handlePause} className="flex-1">
                <PauseIcon className="h-6 w-6 mr-2" />
                Pause
              </Button>
            ) : (
              <Button variant="primary" size="lg" onClick={handleResume} className="flex-1">
                <PlayIcon className="h-6 w-6 mr-2" />
                Resume
              </Button>
            )}
            <Button variant="danger" size="lg" onClick={handleStop} className="flex-1">
              <StopIcon className="h-6 w-6 mr-2" />
              Stop & Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimerWidget;
