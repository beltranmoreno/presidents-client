// src/components/CreateGame.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

const CreateGame = () => {
  const [name, setName] = useState("");
  const [numPlayers, setNumPlayers] = useState(4);
  const [gameCode, setGameCode] = useState(null);
  const [errorMessage, setErrorMessage] = useState({
    error: false,
    message: "Oh no! We have encountered an error.",
  });
  const navigate = useNavigate();

  const handleCreateGame = (e) => {
    e.preventDefault();

    if (!socket.connected) {
      socket.connect();
    }

    // Emit 'createGame' event to the server
    socket.emit("createGame", { name, numPlayers }, (response) => {
      if (response.error) {
        setErrorMessage({ error: true, message: response.error });
      } else {
        setGameCode(response.gameCode);
        // Store playerName and gameCode in localStorage or context
        sessionStorage.setItem("playerName", name);
        sessionStorage.setItem("gameCode", response.gameCode);
        sessionStorage.setItem("playerId", response.playerId);
        navigate("/game");
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6">Create Game</h2>
      <form onSubmit={handleCreateGame} className="w-full max-w-sm">
        <div className="mb-4">
          <label className="block text-gray-700">Nickname:</label>
          <input
            type="text"
            placeholder="eg. Jimmy"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-none"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Number of Players:</label>
          <input
            type="number"
            min="2"
            max="8"
            value={numPlayers}
            onChange={(e) => setNumPlayers(parseInt(e.target.value, 10))}
            className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {errorMessage.error && errorMessage.message && (
          <div className="mb-4 px-4 py-2 bg-red-200 text-red-800 rounded">
            <p>{errorMessage.message}</p>
          </div>
        )}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Create Game
        </button>
      </form>
    </div>
  );
};

export default CreateGame;
