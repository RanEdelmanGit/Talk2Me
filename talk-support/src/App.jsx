import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./styles/App.css";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import ChatPage from "./pages/ChatPage";
import SupportersPage from "./pages/Supporters";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import { useSelector, useDispatch } from "react-redux";

const ProtectedRoute = ({ children }) => {
  // const { user } = useUser();
  const user = useSelector((store) => store.auth.user);
  if (!user.id) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const user = useSelector((store) => store.auth.user);
  return (
    <Router>
      <Routes>
        {user.id && (
          <>
            <Route path="/" element={<Profile/>} />
            <Route path="/supporters" element={<SupportersPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </>
        )}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
