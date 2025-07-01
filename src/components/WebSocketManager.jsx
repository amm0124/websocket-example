// src/components/WebSocketManager.jsx
import React, { useEffect, useState } from 'react';
import { connectWebSocket, disconnectWebSocket, subscribeToTopic, sendMessage } from '../services/websocketService';
import { getWebSocketToken } from '../services/tokenService';

function WebSocketManager() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    return () => {
      disconnectWebSocket();
    };
  }, []);

  const handleConnect = async () => {
    try {
      const token = await getWebSocketToken();
      connectWebSocket(token, (client) => {
        setConnected(true);

        // 구독 예시
        subscribeToTopic('/topic/result', (msg) => {
          console.log('📥 메시지 수신:', msg);
          setMessages(prev => [...prev, msg]);
        });
      });
    } catch (err) {
      console.error('WebSocket 연결 실패:', err.message);
    }
  };

  const handleSendMessage = () => {
    sendMessage('/app/start', { command: 'run', param: 1 });
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>WebSocket 매니저</h2>
      <button onClick={handleConnect} disabled={connected}>
        {connected ? '🔌 연결됨' : '연결하기'}
      </button>

      {connected && (
        <>
          <button onClick={handleSendMessage} style={{ marginLeft: '1rem' }}>
            메시지 보내기
          </button>
          <div style={{ marginTop: '1rem' }}>
            <strong>📨 수신된 메시지:</strong>
            <ul>
              {messages.map((msg, i) => (
                <li key={i}>{JSON.stringify(msg)}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default WebSocketManager;