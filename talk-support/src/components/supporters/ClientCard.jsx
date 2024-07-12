import React from "react";
import { useSelector } from "react-redux";

export default function ClientCard({
  color,
  client,
  handleStartChatClick = () => {},
}) {
  const cccc = useSelector((store) => store.supporters.contactedClients);
  const clientDetails = useSelector((store) =>
    store.supporters.contactedClients.find((c) => c.uid == client.clientId)
  );
  const avatarUrl = `https://placehold.co/200x/${color}/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato`;

  // console.log(client, clientDetails, cccc);

  if (!clientDetails) {
    return <div>loading</div>;
  }
  return (
    <div
      className="w-full mx-auto md:p-3 border-b border-gray-300 flex flex-col"
      dir="rtl"
    >
      <div className="flex items-center justify-between w-full px-10 sm:p-3 sm:gap-3 ">
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-12 h-12 rounded-full"
        />
        <span className="w-32 h-8 overflow-hidden text-ellipsis whitespace-nowrap">
          <h2 className="text-lg font-bold">{client.clientName}</h2>
        </span>

        <span className="flex justify-center items-center w-10">
          <h3 className="text-sm text-gray-500">{clientDetails.age}</h3>
        </span>
        <span className="flex justify-center items-center w-10">
          <h3 className="text-sm text-gray-500">{clientDetails.gender}</h3>
        </span>
        <span className="flex justify-center items-center w-20">
          <h3 className="text-sm text-gray-500">
            {clientDetails.recentStatus}
          </h3>
        </span>
        {client.isVisible && (
          <>
            <span className="flex justify-center items-center w-10">
              <h3 className="text-sm text-gray-500">{clientDetails.area}</h3>
            </span>
            <span className="flex justify-center items-center w-20">
              <h3 className="text-sm text-gray-500">{clientDetails.city}</h3>
            </span>
          </>
        )}

        <button
          className="rounded-md bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleStartChatClick}
        >
          המשך שיחה
        </button>
      </div>
    </div>
  );
}
