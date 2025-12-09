import { useState } from 'react';
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Button from '../components/Common/Button';
import EmptyState from '../components/Common/EmptyState';

function NotesPage() {
  const [notes] = useState([]);

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
          <p className="mt-2 text-gray-600">Keep track of important information</p>
        </div>
        <Button variant="primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Note
        </Button>
      </div>

      <div className="card">
        <EmptyState
          icon={DocumentTextIcon}
          title="No notes yet"
          description="Create notes to keep track of important information."
          action={
            <Button variant="primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Your First Note
            </Button>
          }
        />
      </div>
    </div>
  );
}

export default NotesPage;
