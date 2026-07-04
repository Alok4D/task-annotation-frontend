import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from '@/services/baseApi';
import authReducer from '@/features/auth/authSlice';
import taskReducer from '@/features/tasks/taskSlice';
import annotationReducer from '@/features/annotations/annotationSlice';

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  tasks: taskReducer,
  annotations: annotationReducer,
});
