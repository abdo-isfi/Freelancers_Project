import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PencilIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import Button from '../Common/Button';
import EmptyState from '../Common/EmptyState';
import { deleteTimeEntry } from '../../store/timeEntriesSlice';
import { showSuccess, showError } from '../../utils/toast';
import { useConfirm } from '../../hooks/useConfirm.jsx';

function TimeEntryTable({ entries = [], onEdit }) {
  const dispatch = useDispatch();
  const { items: projects } = useSelector((state) => state.projects);
  const { confirm, ConfirmDialog } = useConfirm();

  const handleDelete = async (id) => {
    const confirmed = await confirm({
      title: 'Delete Time Entry',
      message: 'Are you sure you want to delete this time entry? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });

    if (confirmed) {
      try {
        await dispatch(deleteTimeEntry(id)).unwrap();
        showSuccess('Time entry deleted');
      } catch (error) {
        showError('Failed to delete time entry');
      }
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={ClockIcon}
        title="No time entries yet"
        description="Start tracking time or add a manual entry to see your records here."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
              Project
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
              Description
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
              Duration
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {entries.map((entry) => (
            <tr key={entry.id} className="hover:bg-muted/50">
              <td className="px-4 py-3 text-sm text-foreground">
                {new Date(entry.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-sm text-foreground">
                {getProjectName(entry.projectId)}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {entry.description || 'No description'}
              </td>
              <td className="px-4 py-3 text-sm text-foreground font-medium">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                  {entry.duration?.toFixed(2)}h
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit && onEdit(entry)}
                    className="text-primary hover:text-primary/80 transition-colors"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmDialog />
    </div>
  );
}

export default TimeEntryTable;
