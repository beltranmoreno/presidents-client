import React from "react";

const Player = ({ player }) => {
  return (
    <div className="flex w-full min-w-24 justify-between items-start border px-4 py-4 rounded-lg m-1 bg-white border-gray-300 space-x-4">
      <div>
        <p>{player.name}</p>
        {player.hand && <p> Cards: {player.hand.length}</p>}
      </div>
    </div>
  );
};

export default Player;
