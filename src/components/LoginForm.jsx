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
            "sourceCode": "#include <stdio.h>\n#include <stdlib.h>\n#include \"utils/helper.h\"\n\nint main() {\n    char name[100];\n    printf(\"이름을 입력하세요: \");\n    fgets(name, sizeof(name), stdin);\n    \n    // 개행 문자 제거\n    name[strcspn(name, \"\\n\")] = 0;\n    \n    printf(\"안녕하세요, %s!\\n\", name);\n    \n    char* msg = get_user_input();\n    greet(msg);\n    \n    free(msg);\n    return 0;\n}"
          },
          {
            "fileName": "utils",
            "type": "DIRECTORY",
            "children": [
              {
                "fileName": "helper.h",
                "type": "FILE",
                "sourceCode": "#ifndef HELPER_H\n#define HELPER_H\n\n#include <string.h>\n\nchar* get_user_input();\n                 void greet(const char* meㅇㅇㄴㅊㄴㄹㄴㄹ.'ㄴㄹ.ㅠssage);\n\n#endif"
              },
              {
                "fileName": "helper.c",
                "type": "FILE",
                "sourceCode": "#include \"helper.h\"\n#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nchar* get_user_input() {\n    char* buffer = (char*)malloc(256 * sizeof(char));\n    if (buffer == NULL) {\n        printf(\"메모리 할당 실패\\n\");\n        return NULL;\n    }\n    \n    printf(\"메시지를 입력하세요: \");\n    fgets(buffer, 256, stdin);\n    \n    // 개행 문자 제거\n    buffer[strcspn(buffer, \"\\n\")] = 0;\n    \n    return buffer;\n}\n\nvoid greet(const char* message) {\n    printf(\"입력하신 메시지: %s\\n\", message);\n}"
              }
            ]
          }
        ],
        "settings": {
              "languageId": 12,
              "timeoutMs": 300000.0,
              "memoryLimitMB": 512.0
            }
      }

      // const body = {
      //   "projectName": "C++ Hello World",
      //   "description": "onco 코딩 프로젝트 설명 (C++ 버전)",
      //   "entryPoint": "main.cpp",
      //   "fileStructures": [
      //     {
      //       "fileName": "main.cpp",
      //       "type": "FILE",
      //       "sourceCode": "#include <iostream>\n#include <string>\n#include \"utils/helper.h\"\n\nint main() {\n    std::string name;\n    std::cout << \"이름을 입력하세요: \";\n    std::getline(std::cin, name);\n    \n    std::cout << \"안녕하세요, \" << name << \"!\" << std::endl;\n    \n    std::string msg = get_user_input();\n    greet(msg);\n    \n    return 0;\n}"
      //     },
      //     {
      //       "fileName": "utils",
      //       "type": "DIRECTORY",
      //       "children": [
      //         {
      //           "fileName": "helper.h",
      //           "type": "FILE",
      //           "sourceCode": "#ifndef HELPER_H\n#define HELPER_H\n\n#include <string>\n\nstd::string get_user_input();\nvoid greet(const std::string& message);\n\n#endif"
      //         },
      //         {
      //           "fileName": "helper.cpp",
      //           "type": "FILE",
      //           "sourceCode": "#include \"helper.h\"\n#include <iostream>\n#include <string>\n\nstd::string get_user_input() {\n    std::string buffer;\n    std::cout << \"메시지를 입력하세요: \";\n    std::getline(std::cin, buffer);\n    \n    return buffer;\n}\n\nvoid greet(const std::string& message) {\n    std::cout << \"입력하신 메시지: \" << message << std::endl;\n}"
      //         }
      //       ]
      //     }
      //   ],
      // "settings": {
      //   "languageId": 18,
      //       "timeoutMs": 300000.0,
      //       "memoryLimitMB": 512.0
      // }
      //  }


      // const body = {
      //   "projectName": "JavaScript Hello World",
      //   "description": "onco 코딩 프로젝트 설명 (JavaScript 버전)",
      //   "entryPoint": "main.js",
      //   "fileStructures": [
      //     {
      //       "fileName": "main.js",
      //       "type": "FILE",
      //       "sourceCode": "const readline = require('readline');\nconst { getUserInput, greet } = require('./utils/helper');\n\nconst rl = readline.createInterface({\n    input: process.stdin,\n    output: process.stdout\n});\n\n(async function() {\n    console.log('안녕하세요!');\n    const name = await getUserInput(rl, '이름을 입력하세요: ');\n    console.log(`안녕하세요, ${name}!`);\n    \n    const message = await getUserInput(rl, '메시지를 입력하세요: ');\n    greet(message);\n    \n    rl.close();\n})();"
      //     },
      //     {
      //       "fileName": "utils",
      //       "type": "DIRECTORY",
      //       "children": [
      //         {
      //           "fileName": "helper.js",
      //           "type": "FILE",
      //           "sourceCode": "function getUserInput(rl, prompt) {\n    return new Promise((resolve) => {\n        rl.question(prompt, (answer) => {\n            resolve(answer);\n        });\n    });\n}\n\nfunction greet(message) {\n    console.log(`입력하신 메시지: ${message}`);\n}\n\nmodule.exports = {\n    getUserInput,\n    greet\n};"
      //         }
      //       ]
      //     }
      //   ],
      //   "settings": {
      //     "languageId": 26,
      //     "timeoutSeconds": 1200,
      //     "memoryLimitMB": 512
      //   }
      // }

      // const body = {
      //   "projectName": "Java Hello World",
      //   "description": "onco 코딩 프로젝트 설명 (Java 버전)",
      //   "entryPoint": "Main.java",
      //   "fileStructures": [
      //     {
      //       "fileName": "Main.java",
      //       "type": "FILE",
      //       "sourceCode": "import java.util.Scanner;\nimport utils.Helper;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        \n        System.out.print(\"이름을 입력하세요: \");\n        String name = scanner.nextLine();\n        \n        System.out.println(\"안녕하세요, \" + name + \"!\");\n        \n        String msg = Helper.getUserInput(scanner);\n        Helper.greet(msg);\n        \n        scanner.close();\n    }\n}"
      //     },
      //     {
      //       "fileName": "utils",
      //       "type": "DIRECTORY",
      //       "children": [
      //         {
      //           "fileName": "Helper.java",
      //           "type": "FILE",
      //           "sourceCode": "package utils;\n\nimport java.util.Scanner;\n\npublic class Helper {\n    public static String getUserInput(Scanner scanner) {\n        System.out.print(\"메시지를 입력하세요: \");\n        return scanner.nextLine();\n    }\n    \n    public static void greet(String message) {\n        System.out.println(\"입력하신 메시지: \" + message);\n    }\n}"
      //         }
      //       ]
      //     }
      //   ],
      //
      //   "settings": {
      //         "languageId": 23,
      //         "timeoutMs": 300000.0,
      //         "memoryLimitMB": 512.0
      //       }
      // }



      //
      // const body = {
      //   "projectName": "Python Hello World",
      //   "description": "onco 코딩 프로젝트 설명",
      //   "entryPoint": "main.py",
      //   "fileStructures": [
      //     {
      //       "fileName": "main.py",
      //       "type": "FILE",
      //       "sourceCode": "from utils.helper import get_user_input, greet\n\ndef main():\n    name = input(\"이름을 입력하세요: \")\n    print(f\"안녕하세요, {name}!\")\n\n    msg = get_user_input()\n    greet(msg)\n\nif __name__ == \"__main__\":\n    main()"
      //     },
      //     {
      //       "fileName": "utils",
      //       "type": "DIRECTORY",
      //       "children": [
      //         {
      //           "fileName": "helper.py",
      //           "type": "FILE",
      //           "sourceCode": "def get_user_input():\n    return input(\"메시지를 입력하세요: \")\n\ndef greet(message):\n    print(f\"입력하신 메시지: {message}\")"
      //         }
      //       ]
      //     }
      //   ],
      //   "settings": {
      //     "languageId": 5,
      //     "timeoutMs": 300000.0,
      //     "memoryLimitMB": 512.0
      //   }
      // }


      const result = await requestExecutionInit(body, token);
      console.log(JSON.stringify(result, null, 2));
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
