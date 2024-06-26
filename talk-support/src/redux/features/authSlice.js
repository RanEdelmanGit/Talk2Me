import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

export const userTypeSupporter = "supporter";
export const userTypeClient = "client";

export const meetingOnline = "online";
export const meetingOffline = "offline";
export const meetingAll = "online_and_offline";


const initialState = {
  userType:"",
  formDetails:{},
  user:{},
  status: 'idle',
  error: null,
}

export const fetchUser = createAsyncThunk('auth/fetchUser', async ({ uid, userType }) => {
  const db = getFirestore();
  let userCollectionQuery;

  if (userType === 'client') {
    userCollectionQuery = collection(db, 'clients', uid);
  } else {
    userCollectionQuery = collection(db, 'supporters');
  }

  const querySnapshot = await getDocs(userCollectionQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setFormDetails:(state,action) =>{
      state.formDetails = {...action.payload};
    },
    setUserType:(state,action)=>{
      state.userType = action.payload;
    },
    setUid:(state,action)=>{
      state.user.id = action.payload;
    },
    clearUser: (state) => {
      state.user = {}  
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
})

// Action creators are generated for each case reducer function
export const {setFormDetails, setUserType, setUid, clearUser } = authSlice.actions

export default authSlice.reducer