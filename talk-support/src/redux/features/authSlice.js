import { createSlice } from '@reduxjs/toolkit'

export const userTypeSupporter = "supporter";
export const userTypeClient = "client";

export const meetingOnline = "online";
export const meetingOffline = "offline";
export const meetingAll = "online_and_offline";


const initialState = {
  userType:"",
  formDetails:{},
  user:{}
}


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
})

// Action creators are generated for each case reducer function
export const {setFormDetails, setUserType, setUid, clearUser } = authSlice.actions

export default authSlice.reducer