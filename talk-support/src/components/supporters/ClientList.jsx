import React from "react";
import ClientCard from "./ClientCard";
import colors from "../../constants/profileColors";

export default function ClientList({ clients }) {
  return (
    <div className="mt-4 safe-bottom flex-1">
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
