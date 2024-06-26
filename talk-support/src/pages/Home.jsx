import { Link } from "react-router-dom";
import SignOut from "../components/auth/SignOut";

export default function Home() {
  return (
    <div>
      <div>Home</div>
      <div className="flex p-2 bg-red-500"><SignOut/></div>
      <Link to="/supporters">
        <p className="text-blue-500">supporters</p>
      </Link>
      <Link to="/chat">
        <p className="text-blue-500">chat</p>
      </Link>
      <Link to="/profile">
        <p className="text-blue-500">profile</p>
      </Link>
    </div>
  );
}
