import { createSlice } from '@reduxjs/toolkit'

export const userTypeSupporter = "supporter";
export const userTypeClient = "client";

export const meetingOnline = "online";
export const meetingOffline = "offline";
export const meetingAll = "online_and_offline";


const initialState = {
  userType:"",
  formDetails:{},
}


export const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setFormDetails:(state,action) =>{
      state.formDetails = {...action.payload};
    },
    setUserType:(state,action)=>{
      state.userType = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const {setFormDetails, setUserType} = registrationSlice.actions

export default registrationSlice.reducer