import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFirestore, collection, getDocs, query, where, documentId } from 'firebase/firestore';
import {db} from '../../firebase_config'

// Fetch supporters
export const fetchSupporters = createAsyncThunk('supporters/fetchSupporters', async () => {
  
  const supportersRef = collection(db, "supporters");
  const q = query(supportersRef, where('approved', "==", true))
  const supportersCollection = await getDocs(q);
  console.log(supportersCollection);
  // const supportersCollection = await getDocs(collection(db, 'supporters'));
  return supportersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});

export const loadSupporterByChats = createAsyncThunk('supporters/loadSupporterByChats', async ({ supporterIds }) => {
 console.log('supporterIds', supporterIds)
  const supporterQuery = query(collection(db, 'supporters'), where(documentId(), 'in', supporterIds))
  const supporters = await getDocs(supporterQuery);
  console.log('loadSupporterByChats', supporters);
  return supporters.docs.map(doc => ({ id: doc.id, ...doc.data() }));
})

export const loadClientsByChats = createAsyncThunk('supporters/loadClientsByChats', async ({ clientIds }) => {
  
  if(!clientIds || clientIds.length === 0) return []
  const clientQuery = query(collection(db, "clients"), where(documentId(), 'in', clientIds))
  const clients = await getDocs(clientQuery);
  
  return clients.docs.map(doc => ({ id: doc.id, ...doc.data() }));

})

const supportersSlice = createSlice({
  name: 'supporters',
  initialState: {
    supporters: [],
    contactedSupporters:[],
    contactedClients:[],
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
      })
      .addCase(loadSupporterByChats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadSupporterByChats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contactedSupporters = action.payload;
      })
      .addCase(loadSupporterByChats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loadClientsByChats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadClientsByChats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contactedClients = action.payload;
      })
      .addCase(loadClientsByChats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {displayFavorites, displayAll} = supportersSlice.actions;
export default supportersSlice.reducer;
