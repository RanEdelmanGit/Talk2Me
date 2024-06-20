
import SideBar from "../components/chat/SideBar";
import Chat from "../components/chat/Chat";
import { useUser } from "../context/userContext";

export default function ChatPage() {
  const { user } = useUser();
  console.log(user);
  return (
    <div className="home">
      <div className="container">
        <SideBar />
        <Chat />
      </div>
    </div>
  );
}
