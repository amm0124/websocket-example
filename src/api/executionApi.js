// src/api/executionApi.js

export const requestExecutionInit = async (requestBody, accessToken) => {


  const response = await fetch('https://debug.on-co.net/api/organs/2/execution-init', {
  //const response = await fetch('http://localhost:9012/api/organs/2/execution-init', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`에러: ${errorText}`);
  }

  return await response.json();
};

