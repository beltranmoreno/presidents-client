import React from 'react';

const suitSymbols = {
  Hearts: '♥',
  Diamonds: '♦',
  Clubs: '♣',
  Spades: '♠',
};

const suitColors = {
  Hearts: 'text-red-600',
  Diamonds: 'text-red-600',
  Clubs: 'text-black',
  Spades: 'text-black',
};

const rankDisplay = {
    'Ace': 'A',
    'King': 'K',
    'Queen': 'Q',
    'Jack': 'J',
    '10': '10',
    '9': '9',
    '8': '8',
    '7': '7',
    '6': '6',
    '5': '5',
    '4': '4',
    '3': '3',
    '2': '2',
  };
  

const Card = ({ rank, suit, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col justify-between w-20 h-28 border rounded-lg m-1 cursor-pointer bg-white shadow transition-transform duration-200 ${
        selected ? 'border-blue-500 border-2 transform -translate-y-1' : 'border-gray-300'
      }`}
    >
      {/* Top Left Corner */}
      <div className="absolute top-1 left-2">
        <span className="text-xl font-semibold">{rankDisplay[rank]}</span>
        <span className={`text-xl ${suitColors[suit]}`}>{suitSymbols[suit]}</span>
      </div>

      {/* Center Suit Symbol */}
      <div className={`flex justify-center items-center h-full ${suitColors[suit]}`}>
        <span className="text-4xl">{suitSymbols[suit]}</span>
      </div>

      {/* Bottom Right Corner */}
      <div className="absolute bottom-1 right-2 transform rotate-180">
        <span className="text-xl font-semibold">{rankDisplay[rank]}</span>
        <span className={`text-xl ${suitColors[suit]}`}>{suitSymbols[suit]}</span>
      </div>
    </div>
  );
};

export default Card;
