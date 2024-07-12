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
import { loadChats } from "./redux/features/chatSlice";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase_config";
import { doc, onSnapshot } from "firebase/firestore";
import ChatPage from "./pages/ChatPage";
import ClientsSupportersPage from "./pages/ClientsSupportersPage";
import { useSelector, useDispatch } from "react-redux";
import ClientRegistration from "./pages/ClientRegistration";
import SupporterRegistration from "./pages/SupporterRegistration";
import Contact from "./pages/Contact";

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
    console.log("protected route", isAuth);
    return <Navigate to="/welcome" />;
  }
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { user, isAuth } = useSelector((state) => state.auth);
  const { userType } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  // signOut(auth);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const savedUserType = localStorage.getItem("userType");
      if (currentUser && savedUserType) {
        const uid = currentUser.uid;

        dispatch(setUid(uid));
        dispatch(setUserType(savedUserType)); //TODO detect usertype in autologin fetchuser
        dispatch(fetchUser({ uid, userType }))
          .unwrap()
          .then( user => {
            dispatch(loadChats({ userChats: user.chats.map((c) => c.chatId) }));
          })
        
      } else {
        //localStorage.removeItem("userType");

        navigate("/welcome");
      }
    });

    // let unsubscribeUser;

    // if (isAuth) {
    //   unsubscribeUser = userType == "client" ? "clients" : "supporters";
    //   const userCollection = onSnapshot(
    //     doc(db, userCollection, user.uid),
    //     (doc) => {
    //       if (!doc.exists()) {
    //         // ?
    //       } else {
    //         //dispatch(updateChat(doc.data()));
    //         console.log("chats", doc.chats);
    //       }
    //     }
    //   );
    // }

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
      // unsubscribeUser && unsubscribeUser();
    };
  }, [isAuth]);

  useEffect(() => {
    if (isAuth) {
      navigate("/chat");
    } else {
      navigate("/welcome");
    }
  }, [isAuth]);

  return (
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
  );
}
export default App;
