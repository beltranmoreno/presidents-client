const ServerStatus = ({ connectionStatus  }) => {
  return (
    <div
      className={`justify-between w-4 h-4 rounded-lg m-1 animate-pulse ${
        connectionStatus.conStatus === "connected" ? "bg-green-500" : "bg-red-500"
      }`}
    ></div>
  );
};

export default ServerStatus;
