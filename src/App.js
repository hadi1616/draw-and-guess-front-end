import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import StartGame from './components/views/StartGame';
import GameSession from './components/GameSession';
import HelthCheck from './components/HelthCheck';

const { REACT_APP_API_URL } = process.env;

function App() {
  const [playerType, setPlayerType] = useState('');

  const playerTypeHandler = (type) => setPlayerType(type);

  return (
    <Routes>
      <Route path='/' element={<StartGame updatePlayerType={playerTypeHandler} apiUrl={REACT_APP_API_URL} />} />
      <Route path='roomId/:id' element={<GameSession playerType={playerType} updatePlayerType={playerTypeHandler} apiUrl={REACT_APP_API_URL} />} />
      <Route path='helthCheckStatus' element={<HelthCheck apiUrl={REACT_APP_API_URL} />} />
    </Routes>
  );
}

export default App;
