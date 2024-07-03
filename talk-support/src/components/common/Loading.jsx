import React from "react";

function Loading({ show }) {
  if (!show) return <></>;
  return (
     <span className="loading loading-spinner loading-md"></span>
  );
}

export default Loading;
