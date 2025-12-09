import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/formatDate';

function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="card mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-sm text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
          {user?.company && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <p className="mt-1 text-sm text-gray-900">{user.company}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Member Since</label>
            <p className="mt-1 text-sm text-gray-900">
              {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Preferences</h2>
        <p className="text-gray-600">Preferences settings coming soon...</p>
      </div>
    </div>
  );
}

export default SettingsPage;
