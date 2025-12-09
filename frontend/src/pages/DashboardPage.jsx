import Button from '../components/Common/Button';
import { PlusIcon } from '@heroicons/react/24/outline';

function DashboardPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="card">
          <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">12</p>
          <p className="mt-1 text-sm text-green-500">+2 this month</p>
        </div>
        
        <div className="card">
          <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">8</p>
          <p className="mt-1 text-sm text-blue-500">3 pending</p>
        </div>
        
        <div className="card">
          <p className="text-sm font-medium text-muted-foreground">Hours This Week</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">32.5</p>
          <p className="mt-1 text-sm text-muted-foreground">Target: 40h</p>
        </div>
        
        <div className="card">
          <p className="text-sm font-medium text-muted-foreground">Unbilled Amount</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">$4,250</p>
          <p className="mt-1 text-sm text-yellow-500">5 invoices pending</p>
        </div>
      </div>

      {/* Quick Actions */}

      <div className="card">
        <h2 className="text-lg font-medium text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            New Client
          </Button>
          <Button variant="primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            New Project
          </Button>
          <Button variant="secondary">
            <PlusIcon className="h-5 w-5 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Placeholder for future charts */}
      <div className="mt-6 card">
        <h2 className="text-lg font-medium text-foreground mb-4">Activity Overview</h2>
        <p className="text-muted-foreground">Charts and analytics coming soon...</p>
      </div>
    </div>
  );
}

export default DashboardPage;
