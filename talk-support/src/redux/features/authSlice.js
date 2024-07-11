import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { doc, getDoc,setDoc, getFirestore, updateDoc, arrayUnion } from 'firebase/firestore';
import {db} from '../../firebase_config'

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
  isAuth:false
}

export const fetchUser = createAsyncThunk('auth/fetchUser', async ({ uid, userType }) => {
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
    
    throw new Error('user does not exist or incorrect type')
  // }catch(error){
  //   console.log(error);
  // }
  
});

export const updateUser = createAsyncThunk('auth/updateUser', async (arg, {getState}) => {
  const state = getState();

    await setDoc(doc(db, state.auth.userType+"s", state.auth.user.uid), state.auth.user);
    return {};
 
});

export const updateSupporter = createAsyncThunk('auth/updateSupporter', async ({supporterId, chatId,supporterName}, {getState}) => {
  const state = getState();
  const supporterChat = {chatId, clientId: state.auth.user.uid, clientName: state.auth.user.nickname, supporterId, supporterName, lastMessage:"", readLastMessage:true}
  
  try{
    const supporterRef = doc(db, 'supporters', supporterId);
    await updateDoc(supporterRef, {chats: arrayUnion(supporterChat)})
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
      state.isAuth = true;
    },
    clearUser: (state) => {
      state.user = {}  
      state.status="idle"
      state.isAuth = false;
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
    initChat:(state, action)=>{
      if(!state.user.chats){
        state.user.chats = [];
      }
      const{chatId, supporterId, supporterName } = action.payload;
      state.user.chats.push({chatId, clientId: state.user.uid, clientName: state.user.nickname, supporterId, supporterName, lastMessage:"", readLastMessage:true})
    }
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
        console.log('fulfilled', state.user);
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        console.log('aaaa', action.error.message)
      })
      .addCase(updateSupporter.pending, (state) =>{
        state.status = 'loading';
      })
      .addCase(updateSupporter.fulfilled, (state) => {
        state.status = 'succeeded'; 
      })
      .addCase(updateSupporter.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  }
})

// Action creators are generated for each case reducer function
export const {setFormDetails, setUserType, setUid, clearUser, addFavorite, removeFavorite, initChat } = authSlice.actions

export default authSlice.reducer