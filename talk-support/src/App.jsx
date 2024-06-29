import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import "./styles/index.css";
import Welcome from "./pages/Welcome";
import Registration from "./pages/Registration";
import ChatPage from "./pages/ChatPage";
import SupportersPage from "./pages/Supporters";
import Header from './components/layout/Header';
import { useSelector } from "react-redux";
import { userTypeClient, userTypeSupporter } from "./redux/features/authSlice";


const Root = ({user, userType}) => {
  return (
    <>
      {user.id && <Header user= {user} userType={userType}/>}
      <div className="main-content">
      <Outlet />
      </div>
    </>
  );
};

const ProtectedRoute = ({ children, user }) => {
  if (!user.id) {
    return <Navigate to="/welcome" />;
  }
  return children;
};

function App() {
  const { user } = useSelector((state) => state.auth);
  const userType = userTypeClient;
  return (
    <Router>
      <Routes>
        <Route element={<Root user={user} userType={userType}/>}> 
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
        <Route path="/register" element={<Registration />} />
        <Route path="*" element={<Navigate to="/welcome" />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
