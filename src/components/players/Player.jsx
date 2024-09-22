import React, { useEffect, useState } from "react";

const Player = ({
  player,
  currentPlayer,
  iAmPlayer,
  playerSkipped = false,
  gameStarted = false,
}) => {
  const [playerWasSkipped, setPlayerWasSkipped] = useState(playerSkipped);

  // useEffect to handle the reset of playerWasSkipped after 3 seconds
  useEffect(() => {
    // Set playerWasSkipped to the initial value of playerSkipped
    setPlayerWasSkipped(playerSkipped);

    // Set a timer to reset playerWasSkipped to false after 3 seconds
    const timer = setTimeout(() => {
      setPlayerWasSkipped(false);
    }, 3000);

    // Cleanup the timer when the component unmounts or when playerSkipped changes
    return () => clearTimeout(timer);
  }, [playerSkipped]);

  return (
    <div
      className={`relative flex w-full min-w-24 justify-between items-start border px-4 py-4 rounded-lg m-1 bg-white space-x-4 ${
        currentPlayer
          ? "bg-blue-200 animate-pulse outline-blue-500 border-none outline outline-2 transition ease-in-out"
          : "border-gray-300"
      } ${ playerWasSkipped ? "bg-yellow-100" : ""}`}
    >
      <div>
        <p>{player.name}</p>
        {player.hand && gameStarted && <p> Cards: {player.hand.length}</p>}
        <div className="absolute top-1 right-1 text-blue-500">
          {iAmPlayer && gameStarted && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;
