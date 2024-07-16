import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { doc, getDoc, getDocs, setDoc, query, where, documentId, collection } from 'firebase/firestore';
import {db} from '../../firebase_config'

export const chatCollection = "chats"


const initialState = {
  status:'loading',
  error:'',
  chat:{
    isVisible:false,
    id: "", //supporter.id + client.id
    supporterId:"", //supporterId
    clientId: "",  //supporterId
    messages:[],  // message: {timestamp, text, sender,}
  },
  chats: []
 //supporterChats:[{cliehtId:'', chatId:'', lastMessage:''}]
}

export const resumeChat = createAsyncThunk('chat/resumeChat', async ({ chatId }) => {

  const chat = doc(db, chatCollection, chatId);
  
  const querySnapshot = await getDoc(chat);
  if(querySnapshot.exists()){
    return(querySnapshot.data())
  }
  return {};

})

export const loadChats = createAsyncThunk('chat/loadChats', async ({ userChats }) => {
  if(!userChats || userChats.length === 0) return []
  const chatQuery = query(collection(db, chatCollection), where(documentId(), 'in', userChats))
  const chats = await getDocs(chatQuery);
  //console.log('loadChats', chats);
  
  return chats.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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
        state.chat.messages.push({...action.payload, sentAt: new Date().toISOString()});
        state.chat.lastUpdate = new Date().toISOString();
        const index = state.chats.findIndex(c => c.id == state.chat.id);
        if(index == -1){
          console.log('not found', state);
        }
        state.chats[index] = state.chat;
    },
    startChat:(state,action) => {
      const chat = {
        isVisible:false,
        id:  action.payload.chatId, 
        supporterId: action.payload.supporterId,
        clientId: action.payload.clientId,
        supporterName: action.payload.supporterName,
        clientName: action.payload.clientName,
        messages:[]
      }
      state.chat = chat
      state.chats.push(chat);
    },
    currentChat:(state, action) => {
      const chat = state.chats.find(chat => chat.id == action.payload)
      state.chat   = chat;
    },
    updateChat: (state, action) => {
      if(!action.payload)return;
      state.chat = action.payload;
      const index = state.chats.findIndex(c => c.id == state.chat.id)
      state.chats[index] = state.chat
    },
    updateChats: (state, action) => {
      if(!action.payload)return;
      state.chats = action.payload;
    },
    toggleVisibility: (state, action) =>{
      state.chat.isVisible = !state.chat.isVisible
      const {nickName, fullName} = action.payload;
      if(state.chat.isVisible){
        // client name is client firstname + lastname
        state.chat.clientName = fullName;
      }else{
        // client name is nickname
        state.chat.clientName = nickName;
      }
    },
    updateStatus:(state, action) =>{
      state.status = action.payload
    },
    logoutChat: (state, action) => {
      state.status = 'ready';
      state.error = '';
      state.chat = {
        isVisible:false,
        id: "", //supporter.id + client.id
        supporterId:"", //supporterId
        clientId: "",  //supporterId
        messages:[],  // message: {timestamp, text, sender,}
      };
      state.chats = [];
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
        console.log('loadChats fulfilled', action.payload);
        state.chats = [...action.payload];
      })
      .addCase(loadChats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
})
// Action creators are generated for each case reducer function
export const { addMassage, updateChat, updateChats, startChat, currentChat, logoutChat, toggleVisibility, updateStatus} = chatSlice.actions

export default chatSlice.reducer