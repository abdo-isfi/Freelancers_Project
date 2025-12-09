import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import clientsReducer from './clientsSlice';
import projectsReducer from './projectsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    projects: projectsReducer,
    // More reducers will be added here (tasks, timeEntries, etc.)
  },
  devTools: import.meta.env.DEV, // Enable Redux DevTools in development
});

export default store;
