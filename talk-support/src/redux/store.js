import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import supportersReducer from './features/supportersSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    supporters: supportersReducer,
  },
});

export default store;
