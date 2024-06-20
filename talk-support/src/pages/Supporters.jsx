
import { Link } from "react-router-dom";
import SupporterCard from "../components/supporters/SupporterCard";

export default function SupportersPage() {
  return (
    <div className="">
      <SupporterCard/>
      <Link to="/chat"><p className="text-blue-500">chat</p></Link>
    </div>
  );
}
