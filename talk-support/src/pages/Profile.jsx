import SupporterProfile from "../components/profile/SupporterProfile";
import ClientProfile from "../components/profile/ClientProfile";
import { useSelector } from "react-redux";
import { userTypeSupporter } from "../redux/features/authSlice";

export default function Profile() {
  const { userType, user } = useSelector((state) => state.auth);
  console.log(user);
  return (
    <>
      <h2 className="text-black">hello{user.name}</h2>
      {userType == userTypeSupporter ? <SupporterProfile /> : <ClientProfile />}
    </>
  );
}
