import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/Common/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Toaster position="top-right" />
      <AppRoutes />
    </ErrorBoundary>
  );
}

export default App;
