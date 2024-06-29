
import SideBar from "../components/chat/SideBar";
import Chat from "../components/chat/Chat";

export default function ChatPage({userType}) {
  return (
    <div className="home">
      <div className="container">
        <SideBar />
        <Chat />
      </div>
    </div>
  );
}
