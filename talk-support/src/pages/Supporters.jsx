import { Link } from "react-router-dom";
import SupporterCard from "../components/supporters/SupporterCard";
import { useSelector } from "react-redux";

export default function SupportersPage() {
  const formDetails = useSelector((store) => store.registration.formDetails);

  return (
    <div className="">
      <h2>Hello {formDetails.name}</h2>
      <SupporterCard />
      <Link to="/chat">
        <p className="text-blue-500">chat</p>
      </Link>
    </div>
  );
}
