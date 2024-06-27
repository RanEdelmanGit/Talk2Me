import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

const initialState = {
  status:'ready',
  error:'',
  chat:{
    isVisible:false,
    id: "", //supporter.id + client.id
    supporterId:"", //supporterId
    clientId: "",  //supporterId
    massages:[],  // message: {timestamp, text, sender,}
  },
 //supporterChats:[{cliehtId:'', chatId:'', lastMessage:''}]
}
export const resumeChat = createAsyncThunk('chat/resumeChat', async ({ supporterId, clientId }) => {
  const db = getFirestore();
  try{  
    const chat = doc(db, 'chats', supporterId+clientId);
    
    const querySnapshot = await getDoc(chat);
    if(querySnapshot.exists()){
      return(querySnapshot.data())
    }
    return {};
  }catch(error){
    console.log(error);
  }
})

export const saveChat = createAsyncThunk('chat/saveChat', async ({ chat }) => {
  const db = getFirestore();

  try{
    await setDoc(doc(db, "clientChats", userId), chat);
    //TODO if supporter has a chat with clientId, update its lastMessage field, else add to supporter a new document to db, "supporters", chat.supporterId, 'supporterChats'
    //TODO make supporterChatSlice and ClientChatSlice
    //await setDoc(doc(db, "supporters", chat.supporterId, 'supporterChats'), chat);
    return chat;
  }catch(error){
    console.log(error);
  }
})

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMassage:(state,action) =>{
        state.chat.massages.push(action.payload);
    },
 
  },extraReducers: (builder) => {
    builder
      .addCase(saveChat.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveChat.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log(action.payload);
        state.chat = action.payload;
      })
      .addCase(saveChat.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(resumeChat.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resumeChat.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log(action.payload);
        state.chat = {...action.payload};
      })
      .addCase(resumeChat.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
})
// Action creators are generated for each case reducer function
export const { addMassage} = chatSlice.actions

export default chatSlice.reducer