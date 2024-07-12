import React from "react";
import ClientCard from "./ClientCard";
import colors from "../../constants/profileColors";

export default function ClientList({ clients }) {
  return (
    <div>
      {clients.map((c, index) => {
        return (
          <ClientCard
            key={c.clientId}
            client={c}
            color={colors[index % colors.length]}
          />
        );
      })}
    </div>
  );
}
