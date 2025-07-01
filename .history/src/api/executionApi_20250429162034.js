// src/api/executionApi.js
export const requestExecutionInit = async (requestBody) => {
  const response = await fetch('http://localhost:9011/api/organs/2/debugging-init', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`에러: ${errorText}`);
  }

  return await response.json(); // ExecutionInitResponse expected
};