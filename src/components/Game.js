// src/components/Game.js
import React, { useEffect, useState } from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";
import Card from "./cards/Card";
import Player from "./players/Player";
import CopyButton from "./buttons/CopyButton";
import GameOverScreen from "./GameOverScreen";
import NavBar from "./nav/NavBar";
import SetSize from "./cards/SetSize";

const Game = () => {
  const [gameState, setGameState] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [copied, setCopied] = useState(false);
  const [playError, setPlayError] = useState({ error: false, message: "" });
  const [connectionError, setConnectionError] = useState({
    error: false,
    message: "Connected",
    conStatus: "connected"
  });
  const [message, setMessage] = useState("");
  const [finalStandings, setFinalStandings] = useState([]);
  const [setSize, setSetSize] = useState(0);
  const [playerSkipped, setPlayerSkipped] = useState("");
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
      console.log("state", state);
      setGameState(state);
      setSetSize(state.lastPlayedCards.length);
      setConnectionError({
        error: false,
        message: "Connected",
        conStatus: "connected"
      })
    });

    // Listen for playerSkipped event
    socket.on("playerSkipped", (data) => {
      setMessage(data.message);
      setPlayerSkipped(data.skippedPlayer);

      // Clear the message after a few seconds
      setTimeout(() => setMessage(""), 5000);
    });

    socket.on("error", (message) => {
      alert(`Error: ${message}`);
    });

    socket.on("connect_error", (err) => {
      setConnectionError({ error: true, message: err.message, conStatus: "Error" });
      console.error("Connection error:", err.message);
    });

    socket.on("disconnect", () => {
      setConnectionError({ error: true, message: "Disconnected", conStatus: "Error" });
      console.warn("Disconnected from server");
    });

    // Listen for playerFinished event
    socket.on("playerFinished", (data) => {
      console.log(data.message);
      setMessage(data.message);

      // Optionally, update the game state or display the finished player's info
    });

    socket.on("gameRestarted", () => {
      // Reset game state variables
      setSelectedCards([]);
      setFinalStandings([]);
      setMessage("");

      // Any other state variables to reset
    });

    // Listen for gameEnd event
    socket.on("gameEnd", (data) => {
      console.log(data);
      setMessage(data.message);

      // Display the final standings
      setFinalStandings(data.finishedPlayers);
    });

    return () => {
      socket.off("gameState");
      socket.off("playerSkipped");
      socket.off("playerFinished");
      socket.off("gameRestarted");
      socket.off("gameEnd");
      socket.off("error");
    };
  }, [playerName, gameCode, setSize, navigate]);

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

  const playSelectedCards = () => {
    if (selectedCards.length === 0) {
      setPlayError({
        error: true,
        message: "Please select at least one card to play.",
      });
      return;
    }

    socket.emit(
      "playCard",
      { gameCode, indices: selectedCards },
      (response) => {
        console.log("Response", response);
        if (response.error) {
          setSelectedCards([]);
          setPlayError({ error: true, message: response.error });
        } else {
          // Set error to false
          setPlayError({ error: false, message: "" });
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

  const handleCopyGameCode = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(gameCode).then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        },
        (err) => {
          console.error("Could not copy text: ", err);
        }
      );
    } else {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = gameCode;
      textarea.style.position = "fixed"; // Prevent scrolling to bottom
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
      }
      document.body.removeChild(textarea);
    }
  };

  if (!gameState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        Loading game state
      </div>
    );
  }

  // If the game hasn't started yet
  if (!gameState.gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">
         <h2 className="text-2xl font-semibold text-center mb-6">Waiting for players to join...</h2>
         <CopyButton
          copied={copied}
          onClick={handleCopyGameCode}
          text={gameCode}
        ></CopyButton>
        <p>
          Players Connected: {gameState.numPlayersConnected} /{" "}
          {gameState.numPlayersExpected}
        </p>
        <ul className="mt-4">
          {gameState.players.map((player, idx) => (
            <Player key={idx} player={player} iAmPlayer={playerName === player.name}></Player>
          ))}
        </ul>
      </div>
    );
  }

  if (finalStandings.length > 0) {
    console.log("finished", finalStandings);
    return (
      <div id="content" className="my-8 mx-4">
        <GameOverScreen
          finalStandings={finalStandings}
          gameCode={gameCode}
        ></GameOverScreen>
      </div>
    );
  }

  const player = gameState.players.find((p) => p.name === playerName);
  const copyButton = {
    copied: copied,
    onClick: handleCopyGameCode,
    text: gameCode,
  };
  
  return (
    <>
      <NavBar copyButton={copyButton} connectionStatus={connectionError}></NavBar>
      <div className="flex items-start justify-center min-h-screen bg-gray-100">
        <div
          id="content"
          className="max-w-4xl w-full flex flex-col justify-start items-center my-2 mx-2"
        >
          {/* Display other players */}
          <div className="mb-4 w-full ">
            <div className="flex flex-wrap sm:flex sm:flex-nowrap">
              {gameState.players.map((p, idx) => (
                <Player
                  key={idx}
                  player={p}
                  currentPlayer={gameState.currentPlayer === p.name}
                  iAmPlayer={playerName === p.name}
                  playerSkipped={playerSkipped === p.name}
                  gameStarted={gameState.gameStarted}
                ></Player>
              ))}
            </div>
          </div>

          {/* <CopyButton
            copied={copied}
            onClick={handleCopyGameCode}
            text={gameCode}
          ></CopyButton> */}

          <div className="w-full sm:grid sm:grid-cols-2 sm:gap-4 my-4 mx-4 border rounded-lg">
            {/* Display the last played cards */}
            <div className="my-8 flex justify-center">
              {/* <h3 className="text-lg font-semibold">Last Played Cards:</h3> */}
              {gameState.lastPlayedCards &&
              gameState.lastPlayedCards.length > 0 ? (
                <div className="flex flex-wrap">
                  {gameState.lastPlayedCards.map((card, idx) => (
                    <Card
                      key={idx}
                      rank={card.rank}
                      suit={card.suit}
                      selected={false}
                      onClick={() => {}}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-28 border rounded-lg m-1 bg-white px-4">
                  <p>No cards have been played yet.</p>
                </div>
              )}
            </div>
            <div className="my-8 flex justify-center">
              <SetSize setSize={setSize}></SetSize>
            </div>
          </div>

          {/* Display player's hand */}
          <div className="my-4 flex justify-start w-full">
            {player.hand && player.hand.length > 0 ? (
              <div>
                {/* <h3 className="text-lg font-semibold px-">Your Hand:</h3> */}
                <div className="flex flex-wrap -space-x-4">
                  {player.hand.map((card, index) => (
                    <Card
                      key={index}
                      rank={card.rank}
                      suit={card.suit}
                      selected={selectedCards.includes(index)}
                      onClick={() => toggleCardSelection(index)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold">
                  You have played all of your cards.
                </h3>
              </div>
            )}
          </div>

          {/* Display Message */}
          {message && (
            <div className="absolute top-2 right-2 mb-4 px-4 py-2 bg-yellow-200 text-yellow-800 rounded">
              {message}
            </div>
          )}

          {/* Display error message if move was invalid*/}
          {playError && playError.error ? (
            <div className="mb-4 px-4 sm:h-12 flex items-center bg-red-200 text-red-800 rounded">
              <p>{playError.message}</p>
            </div>
          ) : (
            <div className="mb-4 sm:h-12  ">
              
            </div>
          )}

          {/* Action buttons */}
          {gameState.currentPlayer === playerName ? (
            <div className="flex space-x-4 mb-4">
              <button
                onClick={playSelectedCards}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                {selectedCards && selectedCards.length > 1 ? (
                  <p>Play Cards</p>
                ) : (
                  <p>Play Card</p>
                )}
              </button>
              <button
                onClick={passTurn}
                className="px-6 py-3  text-blue-600 rounded-lg hover:bg-blue-100 transition outline outline-blue-600 outline-2"
              >
                Pass Turn
              </button>
            </div>
          ) : (
            <p className="mb-4 text-lg px-6 py-3">
              Waiting for{" "}
              <span className="font-semibold">{gameState.currentPlayer}</span>{" "}
              to make a move.
            </p>
          )}

          {/* Display other game information */}
          {/* Display all played cards */}
          {/* <div className="mb-4">
            <h3 className="text-lg font-semibold">All Played Cards:</h3>
            {gameState.playedCards && gameState.playedCards.length > 0 ? (
              <div className="flex flex-wrap">
                {gameState.playedCards.map((card, idx) => (
                  <Card
                    key={idx}
                    rank={card.rank}
                    suit={card.suit}
                    selected={false}
                    onClick={() => {}}
                  />
                ))}
              </div>
            ) : (
              <p>No cards have been played yet.</p>
            )}
          </div> */}

          {/* Connection Error */}
          {connectionError && connectionError.error && (
            <div>
              <p>{connectionError.message}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Game;
