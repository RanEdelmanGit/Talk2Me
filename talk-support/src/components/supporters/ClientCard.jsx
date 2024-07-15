import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ClientCard({ color, client }) {
  const navigate = useNavigate();
  const user = useSelector((store) => store.auth.user);
  const clientDetails = useSelector((store) =>
    store.supporters.contactedClients.find((c) => c.uid == client.clientId)
  );
  const avatarUrl = `https://placehold.co/200x/${color}/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato`;

  const handleStartChatClick = () => {
    const chatId = client.clientId + user.uid;
    navigate(`/chat/${chatId}`, { state: { clientId: client.clientId } });
  };

  if (!clientDetails) {
    return <div className="flex justify-center"></div>;
  }

  return (
    <div
      className="w-[92%] md:w-[800px] mx-auto md:p-3 border-b border-gray-300"
      dir="rtl"
    >
      <div className="flex flex-col items-start justify-between w-full py-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="w-12 h-12 rounded-full"
            />
            <span className="w-32 h-8 text-ellipsis whitespace-nowrap">
              <h2 className="text-lg font-bold">{client.clientName}</h2>
            </span>
          </div>
        </div>
        <div className="flex max-md:flex-col justify-between w-full items-center mt-2">
          <div className="flex justify-start gap-2 items-center w-full">
            <span className="flex justify-center items-center">
              <h3 className="text-base text-gray-500">
                {clientDetails.recentStatus} |
              </h3>
            </span>
            <span className="flex justify-center items-center">
              <h3 className="text-base text-gray-500">
                {clientDetails.gender} |
              </h3>
            </span>
            <span className="flex justify-center items-center">
              <h3 className="text-base text-gray-500">{clientDetails.age}</h3>
            </span>
            {client.isVisible && (
              <>
                <h3 className="text-base text-gray-500"></h3>
                <span className="flex justify-center items-center">
                  <h3 className="text-base text-gray-500">
                    {clientDetails.area}
                  </h3>
                </span>
                <span className="flex justify-center items-center">
                  <h3 className="text-base text-gray-500">
                    {clientDetails.city}
                  </h3>
                </span>
              </>
            )}
          </div>
          <div className="flex justify-end w-full max-md:mt-4">
            <button
              className="flex py-1 px-2 mr-2 rounded-md bg-indigo-600 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleStartChatClick}
            >
              המשך שיחה
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
