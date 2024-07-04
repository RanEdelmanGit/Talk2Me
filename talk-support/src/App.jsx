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
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase_config";
import ChatPage from "./pages/ChatPage";
import SupportersPage from "./pages/Supporters";
import Header from "./components/layout/Header";
import { useSelector, useDispatch } from "react-redux";
import { userTypeClient, userTypeSupporter } from "./redux/features/authSlice";
import ClientRegistration from "./pages/ClientRegistration";
import SupporterRegistration from "./pages/SupporterRegistration";

const Root = ({ user, userType }) => {
  return (
    <>
      {user.uid && <Header user={user} userType={userType} />}
      <div className="main-content ">
        <Outlet />
      </div>
    </>
  );
};

const ProtectedRoute = ({ children, user }) => {
  if (!user.uid) {
    return <Navigate to="/welcome" />;
  }
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userType } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const uid = currentUser.uid;
        const userType = localStorage.getItem("userType");
        dispatch(setUid(uid));
        dispatch(setUserType(userType)); //TODO detect usertype in autologin fetchuser
        dispatch(fetchUser({ uid, userType }));
        navigate("/chat");
      } else {
        localStorage.removeItem("userType");
        navigate("/welcome");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route element={<Root user={user} userType={userType} />}>
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
              <ChatPage userType={userType} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supporters"
          element={
            <ProtectedRoute user={user}>
              <SupportersPage userType={userType} />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/chat" />} />
      </Route>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/register/client" element={<ClientRegistration />} />
      <Route path="/register/supporter" element={<SupporterRegistration />} />
      <Route path="*" element={<Navigate to="/welcome" />} />
      {/* <Footer /> */}
    </Routes>
  );
}

export default App;
