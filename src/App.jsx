// src/App.jsx
import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import { connectWebSocket } from './services/websocketService';

function App() {
  const [token, setToken] = useState('');
  const [stompConnected, setStompConnected] = useState(false);

  const handleConnect = (newToken) => {
    const cleanToken = newToken.trim();
    connectWebSocket(cleanToken, () => setStompConnected(true));
    setToken(cleanToken);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>React 로그인 + WebSocket 예제</h1>
      <LoginForm onTokenReceived={handleConnect} />
      {stompConnected && <p>✅ WebSocket 연결됨</p>}
    </div>
  );
}

export default App;
