import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import "./styles/index.css";
import Welcome from "./pages/Welcome";
import { setUid, fetchUser, setUserType } from "./redux/features/authSlice";
import {
  loadChats,
  updateChats,
  updateStatus,
} from "./redux/features/chatSlice";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase_config";
import {
  doc,
  onSnapshot,
  query,
  collection,
  where,
  documentId,
} from "firebase/firestore";
import ChatPage from "./pages/ChatPage";
import ClientsSupportersPage from "./pages/ClientsSupportersPage";
import { useSelector, useDispatch } from "react-redux";
import ClientRegistration from "./pages/ClientRegistration";
import SupporterRegistration from "./pages/SupporterRegistration";
import Contact from "./pages/Contact";
import Loading from "./components/common/Loading";

const Root = () => {
  return (
    <>
      <div className="main-content ">
        <Outlet />
      </div>
    </>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, isAuth } = useSelector((state) => state.auth);

  if (!isAuth) {
    return <Navigate to="/welcome" />;
  }
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { user, isAuth } = useSelector((state) => state.auth);
  const { userType } = useSelector((state) => state.auth);
  const { status } = useSelector((state) => state.chat);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUserType = localStorage.getItem("userType");
    let unsubscribeChats;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && savedUserType) {
        const uid = currentUser.uid;
        dispatch(updateStatus("loading"));
        dispatch(setUid(uid));
        dispatch(setUserType(savedUserType)); //TODO detect usertype in autologin fetchuser
        dispatch(fetchUser({ uid, userType: savedUserType }))
          .unwrap()
          .then((user) => {
            //dispatch(loadChats({ userChats: user.chats.map((c) => c.chatId) }));
            unsubscribeChats = startChatsListener(user);
          });
      } else {
        dispatch(updateStatus("ready"));
        navigate("/welcome");
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
      unsubscribeChats && unsubscribeChats();
    };
  }, [isAuth]);

  const startChatsListener = (user) => {
    if (!isAuth) return () => {};
    const supporterQuery = query(
      collection(db, "chats"),
      where(
        documentId(),
        "in",
        user.chats.map((c) => c.chatId)
      )
    );
    const unsubscribe = onSnapshot(supporterQuery, (chatsSnapshot) => {
      const chats = chatsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (chats.length > 0) {
        dispatch(updateChats(chats));
        dispatch(updateStatus("succeeded"));
        navigate("/chat");
      }
    });
    return unsubscribe;
  };

  // useEffect(() => {
  //   if (isAuth) {
  //     navigate("/chat");
  //   } else if(status != "loading"){
  //     navigate("/welcome");
  //   }
  // }, [isAuth]);

  return (
    <>
      {status == "loading" && (
        <div className="absolute flex justify-center items-center top-0 bottom-0 left-0 right-0 bg-white z-50 ">
          <Loading show={status == "loading"} />
        </div>
      )}

      <Routes>
        <Route element={<Root />}>
          <Route
            path="/chat/:chatId"
            element={
              <ProtectedRoute user={user}>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute user={user}>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supporters"
            element={
              <ProtectedRoute user={user}>
                <ClientsSupportersPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/chat" />} />
        </Route>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register/client" element={<ClientRegistration />} />
        <Route path="/register/supporter" element={<SupporterRegistration />} />
        <Route path="*" element={<Navigate to="/welcome" />} />
        {/* <Footer /> */}
      </Routes>
    </>
  );
}
export default App;
