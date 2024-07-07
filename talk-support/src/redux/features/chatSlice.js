import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { doc, getDoc, getDocs, setDoc, query, where, documentId, collection } from 'firebase/firestore';
import {db} from '../../firebase_config'

export const chatCollection = "chats"

const initialState = {
  status:'ready',
  error:'',
  chat:{
    isVisible:false,
    id: "", //supporter.id + client.id
    supporterId:"xwOsupvBN3UTc0uHKmfRKeY13aa2", //supporterId
    clientId: "",  //supporterId
    massages:[],  // message: {timestamp, text, sender,}
  },
  chats: []
 //supporterChats:[{cliehtId:'', chatId:'', lastMessage:''}]
}

export const resumeChat = createAsyncThunk('chat/resumeChat', async ({ supporterId, clientId }) => {

  try{  
    const chat = doc(db, chatCollection, supporterId+clientId);
    
    const querySnapshot = await getDoc(chat);
    if(querySnapshot.exists()){
      return(querySnapshot.data())
    }
    return {};
  }catch(error){
    console.log(error);
  }
})
export const loadChats = createAsyncThunk('chat/loadChats', async ({ userChats }) => {
  const chatQuery = query(collection(db, chatCollection), where(documentId(), 'in', userChats))
  const chats = await getDocs(chatQuery);
  console.log('loadChats', chats);
  return chats;

})

export const saveChat = createAsyncThunk('chat/saveChat', async (arg, {getState}) => {
  const state = getState();
  const chat = {...state.chat.chat}
  const {uid} = state.auth.user;
  chat.clientId = uid;
  if(chat.id === ""){
    chat.id = chat.supporterId + chat.clientId
  }
  console.log('chat', chat);
  await setDoc(doc(db, chatCollection, chat.id), chat);
  //TODO if supporter has a chat with clientId, update its lastMessage field, else add to supporter a new document to db, "supporters", chat.supporterId, 'supporterChats'
  //TODO make supporterChatSlice and ClientChatSlice
  //await setDoc(doc(db, "supporters", chat.supporterId, 'supporterChats'), chat);
  return chat;
 
})

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMassage:(state,action) =>{
        state.chat.massages.push(action.payload);
    },
    startChat:(state,action) => {
      state.chat.clientId = action.payload.clientId;
      state.chat.supporterId = action.payload.supporterId;
      state.chat.id = action.payload.chatId;
    },

    updateChat: (state, action) => {
      state.chat = action.payload;
    }
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
      })
      .addCase(loadChats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadChats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log('fulfilled', action.payload);
        state.chats = {...action.payload};
      })
      .addCase(loadChats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
})
// Action creators are generated for each case reducer function
export const { addMassage, updateChat, startChat} = chatSlice.actions

export default chatSlice.reducer