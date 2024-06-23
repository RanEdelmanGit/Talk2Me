import { configureStore } from '@reduxjs/toolkit';
import registrationReducer from './features/registrationSlice';
import supportersReducer from './features/supportersSlice';


export const store = configureStore({
  reducer: {
    registration: registrationReducer,
    supporters: supportersReducer,
  },
});

export default store;
