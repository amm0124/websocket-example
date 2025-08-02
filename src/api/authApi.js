export const loginRequest = async (formData) => {


  const response = await fetch('https://api.on-co.net/api/login', {
  //const response = await fetch('http://localhost:9010/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('로그인 실패');
  }

return;
};  