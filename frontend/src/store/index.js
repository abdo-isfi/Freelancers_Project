import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import clientsReducer from './clientsSlice';
import projectsReducer from './projectsSlice';
import tasksReducer from './tasksSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    // More reducers will be added here
  },
  devTools: import.meta.env.DEV,
});

export default store;
