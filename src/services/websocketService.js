import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { memo } from 'react';

let stompClient = null;

export function connectWebSocket(token, uuid, onConnectCallback) {
  const socket = new SockJS(`http://localhost:9011/ws/execution?uuid=${encodeURIComponent(uuid)}`);

  stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    onConnect: (frame) => {
      console.log('🟢 WebSocket 연결 성공:', frame);
      if (onConnectCallback) onConnectCallback(stompClient);
    },
    onStompError: (frame) => {
      console.error('STOMP 오류:', frame);
    },
    onWebSocketError: (err) => {
      console.error('WebSocket 오류:', err);
    },
  });

  stompClient.activate();
}

export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate();
    console.log('🟡 WebSocket 연결 해제됨');
  }
}


  // 구독 후 오는 함수를 비동기적으로 출력함
  export function subscribeToExecutionResult(uuid, callback) {
    console.log("sub start with " + uuid)
    return subscribeToTopic(`/topic/execution/${uuid}`, callback);
  }

  export function subscribeToTopic(topic, callback) {
    if (stompClient && stompClient.connected) {
      stompClient.subscribe(topic, (message) => {
        callback(message.body);
      });
    } else {
      console.warn('WebSocket 연결이 안 되어 있어요.');
    }
  }




export function sendExecutionStart(uuid) {
  console.log('exe start!');
  startExecution(`/app/execution/start/${uuid}`);
}


// destination : /app/execution/start/${uuid}
export function startExecution(destination) {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination,
    });
  } else {
    console.warn('WebSocket 연결이 안 되어 있어요.');
  }
}


export function sendExecutionInput(uuid, inputData) {
  console.log('입력 디버깅용');
  InputToExecution(uuid, `/app/execution/stdin/${uuid}`, inputData);
}

export function InputToExecution(uuid, destination, message) {

  if (stompClient && stompClient.connected) {
    const payload = {
      uuid: uuid,
      stdin: message
    };
    console.log('message', payload);
    stompClient.publish({
      destination,
      body: JSON.stringify(payload), // JSON 객체를 문자열로 변환
    });
  } else {
    console.warn('WebSocket 연결이 안 되어 있어요.');
  }
}