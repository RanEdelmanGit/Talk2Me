import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Fetch supporters
export const fetchSupporters = createAsyncThunk('supporters/fetchSupporters', async () => {
  const db = getFirestore();
  const supportersCollection = await getDocs(collection(db, 'supporters'));
  return supportersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});

const supportersSlice = createSlice({
  name: 'supporters',
  initialState: {
    supporters: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupporters.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSupporters.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.supporters = action.payload;
      })
      .addCase(fetchSupporters.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default supportersSlice.reducer;
