/**
 * Отправляет запрос на авторизацию.
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>} Данные ответа от API.
 * @throws {Error} Если запрос завершился ошибкой.
 */
export async function login(username, password) {
  const response = await fetch("http://127.0.0.1:8000/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Важно: позволяет отправлять и получать httpOnly cookie
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      // Пытаемся получить подробное сообщение об ошибке из ответа API
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (error) {
      console.error(error, "- api/auth login response not ok!");
    }
    throw new Error(errorMessage);
  }

  // Так как httpOnly cookie устанавливается сервером, сам access_token здесь не возвращается в теле ответа.
  // Можно вернуть любые дополнительные данные, если они есть.
  const data = await response.json();

  return data;
}
