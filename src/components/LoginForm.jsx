// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { loginRequest } from '../api/authApi';
import { requestWebSocketToken } from '../api/tokenApi';
import {
  connectWebSocket,
  disconnectWebSocket,
  sendExecutionStart,
  sendExecutionInput,
  subscribeToExecutionResult,
} from '../services/websocketService';
import { requestExecutionInit } from '../api/executionApi';



function LoginForm() {
  const [token, setToken] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [languageId, setLanguageId] = useState(2);
  const [sourceCode, setSourceCode] = useState('');
  const [inputData, setInputData] = useState('');
  const [executionId, setExecutionId] = useState(null);
  const [executionResult] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  

  const handleLogin = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', 'a');
      formData.append('password', 'z');
      formData.append('organId', '2');

      await loginRequest(formData);
      console.log('로그인 성공');
    } catch (error) {
      console.error('로그인 실패:', error.message);
    }
  };

  const handleRequestToken = async () => {
    try {
      const result = await requestWebSocketToken();
      setToken(result);
      console.log('토큰 발급 완료:', result);
    } catch (error) {
      console.error('토큰 요청 실패:', error);
    }
  };

  const handleConnect = () => {
    if (!token) {
      console.warn('먼저 토큰을 발급받으세요.');
      return;
    }
    connectWebSocket(token, executionId,() => {
      setIsConnected(true);
    });
  };

  const handleDisconnect = () => {
    disconnectWebSocket();
    setIsConnected(false);
  };

  const handleRequestExecutionInit = async () => {
    try {

        const body = {
          "projectName": "C Hello World",
          "description": "onco 코딩 프로젝트 설명",
          "entryPoint": "main.c",
          "fileStructures": [
            {
              "fileName": "main.c",
              "type": "FILE",
              "sourceCode": "#include <stdio.h>\n#include \"utils/helper.h\"\n\nint main() {\n    char name[100];\n    printf(\"이름을 입력하세요: \");\n    fgets(name, sizeof(name), stdin);\n    printf(\"안녕하세요, %s!\\n\", name);\n\n    char msg[256];\n    get_user_input(msg, sizeof(msg));\n    greet(msg);\n\n    return 0;\n}"
            },
            {
              "fileName": "utils",
              "type": "DIRECTORY",
              "children": [
                {
                  "fileName": "helper.h",
                  "type": "FILE",
                  "sourceCode": "#ifndef HELPER_H\n#define HELPER_H\n\nvoid get_user_input(char* buffer, int size);\nvoid greet(const char* message);\n\n#endif"
                },
                {
                  "fileName": "helper.c",
                  "type": "FILE",
                  "sourceCode": "#include \"helper.h\"\n#include <stdio.h>\n\nvoid get_user_input(char* buffer, int size) {\n    printf(\"메시지를 입력하세요: \");\n    fgets(buffer, size, stdin);\n}\n\nvoid greet(const char* message) {\n    printf(\"입력하신 메시지: %s\\n\", message);\n}"
                }
              ]
            }
          ],
          "settings": {
            "languageId": 12,
            "timeoutSeconds": 1200,
            "memoryLimitMB": 512
          }
        }


      const result = await requestExecutionInit(body, token);
      console.log('실행 초기화 요청 성공:', result);

      setExecutionId(result.uuid);
      console.log('요청 성공:', result.uuid);
    } catch (error) {
      console.error('실행 초기화 실패:', error.message);
    }
  };

  const handleExecute = () => {
    if (!executionId) {
      console.warn('Execution ID가 없습니다.');
      return;
    }
  
    // 구독은 한 번만 설정 (중복 방지)
    if (!isSubscribed) {
      console.log('start sub!!!!!!!!!!!');
      
      subscribeToExecutionResult(executionId, (res) => {
        console.log(res);
      });
      console.log(executionId);
      setIsSubscribed(true);
    }
    
    console.log('실행 시작 및 입력 전송'); // 위 코드는 비동기 처리로 먼저 실행됨
    sendExecutionStart(executionId);
  };

  const handleSendInput = () => {
    if (!executionId) {
      console.warn('Execution ID가 없습니다.');
      return;
    }
  
    if (!inputData) {
      console.warn('입력값이 비어있습니다.');
      return;
    }
  
    sendExecutionInput(executionId, inputData);
    console.log('입력 데이터 전송 완료:', inputData);
  };


  return (
    <div>
      <h2>로그인</h2>
      <button onClick={handleLogin}>로그인</button>

      <h2>WebSocket</h2>
      <button onClick={handleRequestToken}>WebSocket 토큰 받기</button>
      <p>현재 토큰: <code>{token}</code></p>

      <button onClick={handleConnect} disabled={isConnected}>웹소켓 연결</button>
      <button onClick={handleDisconnect} disabled={!isConnected}>웹소켓 연결 끊기</button>

      <h2>제출 폼</h2>

      <div>
        <label>언어 ID (languageId, 1번 jdk17, 2번 python3.11 3번 c13 4번 c++13) :</label><br />
        <input
          type="number"
          value={languageId}
          onChange={(e) => setLanguageId(e.target.value)}
        />
      </div>

      <div>
        <label>코드 입력:</label><br />
        <textarea
          value={sourceCode}
          onChange={(e) => setSourceCode(e.target.value)}
          rows={10}
          cols={80}
          placeholder="여기에 코드를 입력하세요"
        />
      </div>

      <div>
        <label>문제 입력 (input):</label><br />
        <textarea
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          rows={5}
          cols={80}
          placeholder="문제에 필요한 인풋을 여기에 작성하세요"
        />
      </div>

      <button onClick={handleRequestExecutionInit}>🚀 실행 초기화 요청</button>
      {executionId && <p>✅ Execution ID: {executionId}</p>}

      <button onClick={handleExecute} disabled={!executionId || !isConnected}>
        ▶️ 코드 실행 요청
      </button>

      <button onClick={handleSendInput} disabled={!isConnected || !executionId}>
        ✉️ 문제 입력 전송
      </button>

      {executionResult && (
        <div>
          <h3>실행 결과</h3>
          <pre>{executionResult}</pre>
        </div>
      )}


    </div>




  );
}

export default LoginForm;
