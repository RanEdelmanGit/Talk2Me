import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

export const chatCollection = "chats"
const dummyMessages = [
  { type: "incoming", text: "Hey Bob, how's it going?", sender: "Alice" },
    {
      type: "outgoing",
      text: "Hi Alice! I'm good, just finished a great book. How about you?",
      sender: "Bob",
    },
    {
      type: "incoming",
      text: "That book sounds interesting! What's it about?",
      sender: "Alice",
    },
    {
      type: "outgoing",
      text: "It's about an astronaut stranded on Mars, trying to survive. Gripping stuff!",
      sender: "Bob",
    },
    {
      type: "incoming",
      text: "I'm intrigued! Maybe I'll borrow it from you when you're done?",
      sender: "Alice",
    },
    {
      type: "outgoing",
      text: "Of course! I'll drop it off at your place tomorrow.",
      sender: "Bob",
    },
    { type: "incoming", text: "Thanks, you're the best!", sender: "Alice" },
    {
      type: "outgoing",
      text: "Anytime! Let me know how you like it. 😊",
      sender: "Bob",
    },
    { type: "incoming", text: "So, pizza next week, right?", sender: "Alice" },
    {
      type: "outgoing",
      text: "Absolutely! Can't wait for our pizza date. 🍕",
      sender: "Bob",
    },
    { type: "incoming", text: "Hoorayy!!", sender: "Alice" },
];
const initialState = {
  status:'ready',
  error:'',
  chat:{
    isVisible:false,
    id: "", //supporter.id + client.id
    supporterId:"", //supporterId
    clientId: "",  //supporterId
    massages:dummyMessages,  // message: {timestamp, text, sender,}
  },
 //supporterChats:[{cliehtId:'', chatId:'', lastMessage:''}]
}
export const resumeChat = createAsyncThunk('chat/resumeChat', async ({ supporterId, clientId }) => {
  const db = getFirestore();
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

export const saveChat = createAsyncThunk('chat/saveChat', async ({ chat }) => {
  const db = getFirestore();

  try{
    await setDoc(doc(db, chatCollection, userId), chat);
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