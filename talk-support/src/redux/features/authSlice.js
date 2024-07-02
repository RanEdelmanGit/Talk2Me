import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { doc, getDoc,setDoc, getFirestore } from 'firebase/firestore';

export const userTypeSupporter = "supporter";
export const userTypeClient = "client";

export const meetingOnline = "וידיאו";
export const meetingOffline = "מפגש";
export const phoneCall = "טלפון";


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

  //try{
    if (userType === userTypeClient) {
      userCollectionQuery = doc(db, 'clients', uid);
    } else {
      userCollectionQuery = doc(db, 'supporters', uid);
    }
  
    const querySnapshot = await getDoc(userCollectionQuery);
    if(querySnapshot.exists()){
      return(querySnapshot.data())
    }
    console.log('here');
    throw new Error('user does not exist or incorrect type')
  // }catch(error){
  //   console.log(error);
  // }
  
});
export const updateUser = createAsyncThunk('auth/updateUser', async (arg, {getState}) => {
  const db = getFirestore();
  const state = getState();
  console.log('state', state);
  try{
    await setDoc(doc(db, "clients", state.auth.user.uid), state.auth.user);
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
      state.user.uid = action.payload;
    },
    clearUser: (state) => {
      state.user = {}  
      state.status="idle"
    },
    addFavorite:(state,action)=>{ // action.payload: supporter id
      if(!state.user.favorites){
        state.user.favorites= []
      }
      state.user.favorites.push(action.payload);
    },
    removeFavorite:(state,action)=>{  // action.payload: supporter id
      state.user.favorites =  state.user.favorites.filter(fav =>fav != action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = {...state.user, ...action.payload};
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = action.error.message;
        state.error = action.error.message;
        state.user = {}
      }).addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = {...state.user, ...action.payload};
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
})

// Action creators are generated for each case reducer function
export const {setFormDetails, setUserType, setUid, clearUser, addFavorite, removeFavorite } = authSlice.actions

export default authSlice.reducer