// src/components/Game.js
import React, { useEffect, useState } from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

const Game = () => {
  const [gameState, setGameState] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const playerName = sessionStorage.getItem("playerName");
  const gameCode = sessionStorage.getItem("gameCode");
  const navigate = useNavigate();

  useEffect(() => {
    if (!playerName || !gameCode) {
      // Redirect to home if no playerName or gameCode
      navigate("/");
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    // Emit 'joinGame' event to the server
    socket.emit("joinGame", { name: playerName, gameCode }, (response) => {
      if (response.error) {
        alert(`Error: ${response.error}`);
        navigate("/");
      } else {
        console.log("Joined game successfully");
      }
    });

    socket.on("gameState", (state) => {
      setGameState(state);
    });

    socket.on("error", (message) => {
      alert(`Error: ${message}`);
    });

    return () => {
      socket.off("gameState");
      socket.off("error");
    };
  }, [playerName, gameCode]);

  // Function to handle card selection
  const toggleCardSelection = (index) => {
    if (selectedCards.includes(index)) {
      // Deselect the card
      setSelectedCards(selectedCards.filter((i) => i !== index));
    } else {
      // Select the card
      setSelectedCards([...selectedCards, index]);
    }
  };

  // Function to play selected cards
  const playSelectedCards = () => {
    if (selectedCards.length === 0) {
      alert("Please select at least one card to play.");
      return;
    }

    socket.emit(
      "playCard",
      { gameCode, indices: selectedCards },
      (response) => {
        if (response.error) {
          alert(`Error: ${response.error}`);
        } else {
          // Clear selected cards after successful play
          setSelectedCards([]);
        }
      }
    );
  };

  // Function to pass turn
  const passTurn = () => {
    socket.emit("passTurn", { gameCode }, (response) => {
      if (response.error) {
        alert(`Error: ${response.error}`);
      }
    });
  };

  if (!gameState) {
    return <div>Loading game state...</div>;
  }

  // If the game hasn't started yet
  if (!gameState.gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-xl font-bold mb-4">Game Code: {gameCode}</h2>
        <h3 className="text-lg mb-4">Waiting for players to join...</h3>
        <p>
          Players Connected: {gameState.numPlayersConnected} /{" "}
          {gameState.numPlayersExpected}
        </p>
        <ul className="mt-4">
          {gameState.players.map((player) => (
            <li key={player.name}>{player.name}</li>
          ))}
        </ul>
      </div>
    );
  }

  const player = gameState.players.find((p) => p.name === playerName);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Player: {playerName}</h2>
      <h2 className="text-xl font-bold mb-2">Game Code: {gameCode}</h2>

      {/* Display other players */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Players:</h3>
        <ul className="list-disc list-inside">
          {gameState.players.map((p) => (
            <li key={p.name}>
              {p.name} - Cards Remaining: {p.hand.length}
            </li>
          ))}
        </ul>
      </div>

      {/* Display the last played cards */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Last Played Cards:</h3>
        {gameState.lastPlayedCards && gameState.lastPlayedCards.length > 0 ? (
          <div className="flex flex-wrap">
            {gameState.lastPlayedCards.map((card, idx) => (
              <div
                key={idx}
                className="border border-gray-300 rounded p-2 m-1 bg-white shadow"
              >
                <p>
                  {card.rank} of {card.suit}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No cards have been played yet.</p>
        )}
      </div>

      {/* Display all played cards */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">All Played Cards:</h3>
        {gameState.playedCards && gameState.playedCards.length > 0 ? (
          <div className="flex flex-wrap">
            {gameState.playedCards.map((card, idx) => (
              <div
                key={idx}
                className="border border-gray-300 rounded p-2 m-1 bg-white shadow"
              >
                <p>
                  {card.rank} of {card.suit}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No cards have been played yet.</p>
        )}
      </div>

      {/* Display player's hand */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Your Hand:</h3>
        <div className="flex flex-wrap">
          {player.hand.map((card, index) => (
            <div
              key={index}
              onClick={() => toggleCardSelection(index)}
              className={`border rounded p-2 m-1 cursor-pointer bg-white shadow ${
                selectedCards.includes(index)
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
            >
              <p>
                {card.rank} of {card.suit}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      {gameState.currentPlayer === playerName ? (
        <div className="flex space-x-4 mb-4">
          <button
            onClick={playSelectedCards}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Play Selected Cards
          </button>
          <button
            onClick={passTurn}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            Pass Turn
          </button>
        </div>
      ) : (
        <p className="mb-4">Waiting for other players...</p>
      )}

      {/* Current player */}
      <p className="text-lg">
        Current Player:{" "}
        <span className="font-semibold">{gameState.currentPlayer}</span>
      </p>

      {/* Display other game information */}
    </div>
  );
};

export default Game;
