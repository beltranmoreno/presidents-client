// src/components/JoinGame.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";

const JoinGame = () => {
  const [name, setName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const navigate = useNavigate();

  const handleJoinGame = (e) => {
    e.preventDefault();

    if (!socket.connected) {
      socket.connect();
    }
    // Emit 'joinGame' event to the server
    socket.emit("joinGame", { name, gameCode }, (response) => {
      console.log("response", response);
      if (response.error) {
        alert(response.error);
      } else {
        console.log("join");
        // Store playerName and gameCode in localStorage or context
        sessionStorage.setItem("playerName", name);
        sessionStorage.setItem("gameCode", gameCode);
        navigate("/game");
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Join Game</h2>
        <form onSubmit={handleJoinGame} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Game Code:</label>
            <input
              type="text"
              required
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Join Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinGame;
