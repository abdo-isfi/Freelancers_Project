import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Toaster position="top-right" />
      <AppRoutes />
    </Provider>
  );
}

export default App;
