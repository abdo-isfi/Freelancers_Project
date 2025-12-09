import { ClockIcon, PlayIcon } from '@heroicons/react/24/outline';
import Button from '../components/Common/Button';
import EmptyState from '../components/Common/EmptyState';

function TimeTrackingPage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Time Tracking</h1>
          <p className="mt-2 text-gray-600">Track time spent on projects and tasks</p>
        </div>
        <Button variant="primary">
          <PlayIcon className="h-5 w-5 mr-2" />
          Start Timer
        </Button>
      </div>

      {/* Timer Widget */}
      <div className="card mb-6">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-2">00:00:00</h2>
          <p className="text-gray-600 mb-4">No active timer</p>
          <Button variant="primary" size="lg">
            <PlayIcon className="h-6 w-6 mr-2" />
            Start Tracking
          </Button>
        </div>
      </div>

      {/* Time Entries */}
      <div className="card">
        <EmptyState
          icon={ClockIcon}
          title="No time entries yet"
          description="Start tracking time to see your entries here."
        />
      </div>
    </div>
  );
}

export default TimeTrackingPage;
