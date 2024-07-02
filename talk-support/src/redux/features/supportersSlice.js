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
    showFavorites:false,
    status: 'idle',
    error: null,
  },
  reducers: {
    displayFavorites:(state, action) =>{
      state.showFavorites = true;
    },
    displayAll:(state, action) =>{
      state.showFavorites = false;
    },
  },
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

export const {displayFavorites, displayAll} = supportersSlice.actions;
export default supportersSlice.reducer;
