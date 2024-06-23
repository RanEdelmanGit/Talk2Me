import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <div>Home</div>
      <Link to="/supporters">
        <p className="text-blue-500">supporters</p>
      </Link>
      <Link to="/chat">
        <p className="text-blue-500">chat</p>
      </Link>
    </div>
  );
}
