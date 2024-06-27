import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { doc, getDoc, getFirestore } from 'firebase/firestore';

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

  try{
    if (userType === userTypeClient) {
      userCollectionQuery = doc(db, 'clients', uid);
    } else {
      userCollectionQuery = doc(db, 'supporters', uid);
    }
  
    const querySnapshot = await getDoc(userCollectionQuery);
    if(querySnapshot.exists()){
      return(querySnapshot.data())
    }
    return {};
  }catch(error){
    console.log(error);
  }
  
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
        console.log(action.payload);
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