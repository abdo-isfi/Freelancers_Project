import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Button from '../components/Common/Button';
import EmptyState from '../components/Common/EmptyState';

import { AnimatedText } from '../components/ui/animated-shiny-text';

function NotesPage() {
  const { t } = useTranslation();
  const [notes] = useState([]);

  return (
    <div className="p-6">
      <div className="mb-[5px] mt-8 flex flex-col gap-4">
        <div className="text-center w-full">
          <AnimatedText 
            text={t('notes')} 
            textClassName="text-5xl font-bold text-foreground"
            className="justify-center py-2"
          />
          <p className="mt-2 text-muted-foreground">{t('organizeYourNotes')}</p>
        </div>
        <div className="w-full flex justify-end">
          <Button variant="primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('addNote')}
          </Button>
        </div>
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
