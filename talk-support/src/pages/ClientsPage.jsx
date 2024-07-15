import React, { useEffect, useState } from "react";
import ClientSearch from "../components/supporters/ClientSearch";
import ClientList from "../components/supporters/ClientList";
import { useDispatch, useSelector } from "react-redux";
import { loadClientsByChats } from "../redux/features/supportersSlice";

const ClientsPage = () => {
  const { chats } = useSelector((store) => store.chat);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadClientsByChats({ clientIds: chats.map((c) => c.clientId) }));
  }, [chats]);

  const buildClients = () => {
    return chats
      .map((c) => {
        return {
          clientId: c.clientId,
          clientName: c.clientName,
          isVisible: c.isVisible,
        };
      })
      .filter((client) =>
        search == "" ? true : client.clientName.includes(search)
      );
  };

  return (
    <div className="flex flex-col w-full mx-auto">
      <ClientSearch search={search} setSearch={setSearch} />
      <ClientList clients={buildClients()} />
    </div>
  );
};

export default ClientsPage;
