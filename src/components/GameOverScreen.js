import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import socket from "../socket";
import { useNavigate } from "react-router-dom";


const GameOverScreen = ({ finalStandings, gameCode }) => {
  const [playAgain, setPlayAgain] = useState(false);
  const [waitingForOthers, setWaitingForOthers] = useState(false);

  const navigate = useNavigate();

  const handlePlayAgain = () => {
    socket.emit("playAgain", { gameCode }, (response) => {
      if (response.error) {
        alert(`Error: ${response.error}`);
      } else {
        setPlayAgain(true);
        setWaitingForOthers(true);
      }
    });
  };

  useEffect(() => {
    socket.on("gameRestarted", () => {
      // Reset local game state and navigate to the game screen
      setPlayAgain(false);
      setWaitingForOthers(false);
      // Optionally, reset other state variables or redirect
      navigate('/game');
    });

    return () => {
      socket.off("gameRestarted");
    };
  }, [navigate]);

  if (waitingForOthers) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">
          Waiting for other players...
        </h2>
      </div>
    );
  }
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-4xl sm:text-4xl lg:text-5xl font-extrabold mb-8">🏆 Game Over 🏆</h2>
        {finalStandings.map((player, idx) => (
          <div
            key={idx}
            className={`flex items-center mb-4 w-full max-w-md relative ${
              player.title === "President"
                ? "bg-yellow-400 bg-opacity-40 text-black py-6 px-4 rounded-xl shadow-xl"
                : player.title === "Vice President"
                ? "bg-zinc-200 text-black p-4 rounded-xl"
                : player.title === "Neutral"
                ? "bg-gray-200 text-black p-4 rounded-xl"
                : player.title === "Vice Scum"
                ? "bg-gray-200 text-black p-4 rounded-xl"
                : player.title === "Scum"
                ? "bg-gray-200 text-black p-4 rounded-xl"
                : ""
            }`}
          >
            <div className="flex-shrink-0 mr-4">
              {player.title === "President" && (
                <svg
                  alt="Crown"
                  className="w-12 h-12 animate-bounce text-yellow-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  fill="currentColor"
                >
                  <path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6l277.2 0c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z" />
                </svg>
              )}
              {player.title === "Vice President" && (
                <svg
                  alt="Medal"
                  className="w-12 h-12"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M4.1 38.2C1.4 34.2 0 29.4 0 24.6C0 11 11 0 24.6 0L133.9 0c11.2 0 21.7 5.9 27.4 15.5l68.5 114.1c-48.2 6.1-91.3 28.6-123.4 61.9L4.1 38.2zm503.7 0L405.6 191.5c-32.1-33.3-75.2-55.8-123.4-61.9L350.7 15.5C356.5 5.9 366.9 0 378.1 0L487.4 0C501 0 512 11 512 24.6c0 4.8-1.4 9.6-4.1 13.6zM80 336a176 176 0 1 1 352 0A176 176 0 1 1 80 336zm184.4-94.9c-3.4-7-13.3-7-16.8 0l-22.4 45.4c-1.4 2.8-4 4.7-7 5.1L168 298.9c-7.7 1.1-10.7 10.5-5.2 16l36.3 35.4c2.2 2.2 3.2 5.2 2.7 8.3l-8.6 49.9c-1.3 7.6 6.7 13.5 13.6 9.9l44.8-23.6c2.7-1.4 6-1.4 8.7 0l44.8 23.6c6.9 3.6 14.9-2.2 13.6-9.9l-8.6-49.9c-.5-3 .5-6.1 2.7-8.3l36.3-35.4c5.6-5.4 2.5-14.8-5.2-16l-50.1-7.3c-3-.4-5.7-2.4-7-5.1l-22.4-45.4z" />
                </svg>
              )}
              {player.title === "Vice Scum" && (
                <svg
                  alt="Frown"
                  className="w-12 h-12"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM159.3 388.7c-2.6 8.4-11.6 13.2-20 10.5s-13.2-11.6-10.5-20C145.2 326.1 196.3 288 256 288s110.8 38.1 127.3 91.3c2.6 8.4-2.1 17.4-10.5 20s-17.4-2.1-20-10.5C340.5 349.4 302.1 320 256 320s-84.5 29.4-96.7 68.7zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                </svg>
              )}
              {player.title === "Scum" && (
                <svg
                  alt="Skull"
                  className="w-12 h-12"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M416 398.9c58.5-41.1 96-104.1 96-174.9C512 100.3 397.4 0 256 0S0 100.3 0 224c0 70.7 37.5 133.8 96 174.9c0 .4 0 .7 0 1.1l0 64c0 26.5 21.5 48 48 48l48 0 0-48c0-8.8 7.2-16 16-16s16 7.2 16 16l0 48 64 0 0-48c0-8.8 7.2-16 16-16s16 7.2 16 16l0 48 48 0c26.5 0 48-21.5 48-48l0-64c0-.4 0-.7 0-1.1zM96 256a64 64 0 1 1 128 0A64 64 0 1 1 96 256zm256-64a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold">{player.name}</h3>
              <p className="text-lg">{player.title}</p>
              <h3 className="text-7xl font-bold absolute top-1 right-2 opacity-30">
                {player.position}
              </h3>
            </div>
          </div>
        ))}
        {/* Add a button to return to the main menu */}

        <div className="space-x-4 mt-4">
          <button onClick={handlePlayAgain} className="px-6 py-3 w-32 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Play Again
          </button>

          <Link to="/">
            <button className="px-6 py-3 w-32 bg-white text-blue-600 rounded-lg hover:bg-blue-100 transition outline outline-blue-600 outline-2">
              Exit
            </button>
          </Link>
        </div>
      </div>
    );
  };

export default GameOverScreen;
