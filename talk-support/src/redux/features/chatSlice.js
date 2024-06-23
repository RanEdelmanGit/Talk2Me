import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  massages:[],
  participants:{},
  timeStamp:"",
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMassage:(state,action) =>{
        state.massages.push(action.payload);
    },
    resumeChat:(state,action) =>{
        state.massages = [...action.payload.massages];
        state.participants = {...action.payload.participants};
        state.timeStamp = action.payload.timeStamp;
    },
  },
})
// Action creators are generated for each case reducer function
export const { addMassage, resumeChat} = chatSlice.actions

export default chatSlice.reducer