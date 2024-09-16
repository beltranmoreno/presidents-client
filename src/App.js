// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import Game from './components/Game';

const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/create" element={<CreateGame />} />
    <Route path="/join" element={<JoinGame />} />
    <Route path="/game" element={<Game />} />
  </Routes>
);

export default App;
