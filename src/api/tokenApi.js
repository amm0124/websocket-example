// src/api/tokenApi.js
export const requestWebSocketToken = async () => {
    const response = await fetch('http://localhost:9010/api/websocket-token', {
      method: 'POST', // or 'GET' depending on your backend
      credentials: 'include', // 세션/쿠키 인증이 필요한 경우
    });
  
    if (!response.ok) {
      throw new Error('WebSocket 토큰 요청 실패');
    }
  

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data.accessToken;
    } else {
      // 예외적으로 text로 올 경우 토큰으로 간주
      return await response.text();
    }

  };