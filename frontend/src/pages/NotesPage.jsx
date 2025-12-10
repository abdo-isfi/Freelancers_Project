import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Button from '../components/Common/Button';
import EmptyState from '../components/Common/EmptyState';

function NotesPage() {
  const { t } = useTranslation();
  const [notes] = useState([]);

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('notes')}</h1>
          <p className="mt-2 text-gray-600">{t('organizeYourNotes')}</p>
        </div>
        <Button variant="primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          {t('addNote')}
        </Button>
      </div>

      <div className="card">
        <EmptyState
          icon={DocumentTextIcon}
          title={t('noNotesYet')}
          description={t('getStartedFirstNote')}
          action={
            <Button variant="primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              {t('createFirstNote')}
            </Button>
          }
        />
      </div>
    </div>
  );
}

export default NotesPage;
