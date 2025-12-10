import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PlusIcon } from '@heroicons/react/24/outline';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import RevenueChart from '../components/Widgets/RevenueChart';
import TimeByProjectChart from '../components/Widgets/TimeByProjectChart';
import RecentActivity from '../components/Widgets/RecentActivity';
import { fetchClients } from '../store/clientsSlice';
import { fetchProjects } from '../store/projectsSlice';
import { fetchTimeEntries } from '../store/timeEntriesSlice';
import { fetchInvoices } from '../store/invoicesSlice';
import * as dashboardAPI from '../api/dashboardAPI';
import { AnimatedText } from '../components/ui/animated-shiny-text';

function DashboardPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const { items: clients } = useSelector((state) => state.clients);
  const { items: projects } = useSelector((state) => state.projects);
  const { items: timeEntries } = useSelector((state) => state.timeEntries);
  const { items: invoices } = useSelector((state) => state.invoices);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all data
        await Promise.all([
          dispatch(fetchClients()),
          dispatch(fetchProjects()),
          dispatch(fetchTimeEntries()),
          dispatch(fetchInvoices()),
        ]);

        // Fetch dashboard stats from API
        try {
          const response = await dashboardAPI.getDashboardStats();
          setStats(response.data);
        } catch (error) {
          console.error('Failed to fetch dashboard stats:', error);
          // Calculate stats locally if API fails
          calculateLocalStats();
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const calculateLocalStats = () => {
    const activeProjects = projects.filter((p) => p.status === 'active').length;
    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);

    const hoursThisWeek = timeEntries
      .filter((entry) => new Date(entry.date) >= thisWeekStart)
      .reduce((sum, entry) => sum + (entry.duration || 0), 0);

    const unbilledAmount = invoices
      .filter((inv) => inv.status === 'unpaid')
      .reduce((sum, inv) => sum + (inv.total || 0), 0);

    setStats({
      totalClients: clients.length,
      activeProjects,
      hoursThisWeek,
      unbilledAmount,
    });
  };

  // Prepare chart data
  const prepareRevenueData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => {
      const monthRevenue = invoices
        .filter((inv) => {
          const invDate = new Date(inv.date);
          return invDate.getMonth() === index && inv.status === 'paid';
        })
        .reduce((sum, inv) => sum + (inv.total || 0), 0);
      return { month, revenue: monthRevenue };
    });
  };

  const prepareTimeByProjectData = () => {
    const projectHours = {};
    timeEntries.forEach((entry) => {
      const project = projects.find((p) => p.id === entry.projectId);
      if (project) {
        projectHours[project.name] = (projectHours[project.name] || 0) + (entry.duration || 0);
      }
    });

    return Object.entries(projectHours)
      .map(([name, hours]) => ({ name, hours: parseFloat(hours.toFixed(1)) }))
      .slice(0, 6); // Top 6 projects
  };

  const prepareRecentActivities = () => {
    const activities = [];

    // Recent time entries
    timeEntries.slice(0, 3).forEach((entry) => {
      const project = projects.find((p) => p.id === entry.projectId);
      activities.push({
        type: 'time_entry',
        title: t('timeTracked'),
        description: t('timeTrackedDesc', { 
          duration: entry.duration?.toFixed(1), 
          project: project?.name || t('unknownProject') 
        }),
        timestamp: entry.date,
      });
    });

    // Recent invoices
    invoices.slice(0, 2).forEach((invoice) => {
      activities.push({
        type: 'invoice',
        title: t('invoiceCreated'),
        description: t('invoiceCreatedDesc', { 
          number: invoice.invoiceNumber, 
          amount: invoice.total?.toFixed(2) 
        }),
        timestamp: invoice.date,
      });
    });

    // Sort by timestamp
    return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-6 mt-8 text-center">
        <AnimatedText 
          text={t('dashboard')} 
          textClassName="text-5xl font-bold text-foreground"
          className="justify-center py-2"
        />
        <p className="mt-2 text-muted-foreground">{t('welcome')}</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid mb-8">
        <div className="card">
          <p className="text-sm font-medium text-muted-foreground">{t('totalClients')}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {stats?.totalClients || clients.length}
          </p>
          <p className="mt-1 text-sm text-green-500">
            {clients.length > 0 ? `+${Math.min(2, clients.length)} this month` : t('noClientsYet')}
          </p>
        </div>

        <div className="card">
          <p className="text-sm font-medium text-muted-foreground">{t('activeProjects')}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {stats?.activeProjects || projects.filter((p) => p.status === 'active').length}
          </p>
          <p className="mt-1 text-sm text-blue-500">
            {t('noActiveProjects')}
          </p>
        </div>

        <div className="card">
          <p className="text-sm font-medium text-muted-foreground">{t('hoursThisWeek')}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {stats?.hoursThisWeek?.toFixed(1) || '0.0'}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Target: 40h</p>
        </div>

        <div className="card">
          <p className="text-sm font-medium text-muted-foreground">{t('unbilledAmount')}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            ${stats?.unbilledAmount?.toFixed(2) || '0.00'}
          </p>
          <p className="mt-1 text-sm text-yellow-500">
            {t('noInvoicesPending')}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">{t('quickActions')}</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => navigate('/clients')}>
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('newClient')}
          </Button>
          <Button variant="primary" onClick={() => navigate('/projects')}>
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('newProject')}
          </Button>
          <Button variant="primary" onClick={() => navigate('/invoices')}>
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('newInvoice')}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/time-tracking')}>
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('trackTime')}
          </Button>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid mb-8">
        <div className="card">
          <h2 className="text-lg font-medium text-foreground mb-4">{t('revenueOverview')}</h2>
          <RevenueChart data={prepareRevenueData()} />
        </div>

        <div className="card">
          <h2 className="text-lg font-medium text-foreground mb-4">{t('timeByProject')}</h2>
          <TimeByProjectChart data={prepareTimeByProjectData()} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-medium text-foreground mb-4">{t('recentActivity')}</h2>
        <RecentActivity activities={prepareRecentActivities()} />
      </div>
    </div>
  );
}

export default DashboardPage;
