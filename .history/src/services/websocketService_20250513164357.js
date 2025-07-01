import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

export function connectWebSocket(token, onConnectCallback) {
  const socket = new SockJS('http://localhost:9011/ws');

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
  return subscribeToTopic(`/topic/debug/${uuid}`, callback);
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
  
  const message = {
    debugBreakpointRequestList: [
      { filePath: "src/hello.py", lineNumber: 7, isEnable: true },
    ],
    expressionList: ["a", "b+c"]
  };

  startExecution(`/app/debug/start/${uuid}`, message);
}

export function startExecution(destination, message) {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination,
      body: JSON.stringify(message),
    });
  } else {
    console.warn('WebSocket 연결이 안 되어 있어요.');
  }
}




export function sendExecutionInput(uuid, inputData) {
  console.log('입력 디버깅용');
  InputToExecution(`/app/debug/input/${uuid}`, inputData);
}

export function InputToExecution(destination, message) {
  if (stompClient && stompClient.connected) {
    console.log('message ', message);
    stompClient.publish({
      destination,
      body: message, // JSON.stringify 제거!
    });
  } else {
    console.warn('WebSocket 연결이 안 되어 있어요.');
  }
}