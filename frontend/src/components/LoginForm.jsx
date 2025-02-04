import { useState } from "react";
import { login } from "../api/auth";

function LoginForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await login(form.username, form.password);
      console.log("Form submitted successfully:", data);
      // Например, можно выполнить редирект или обновление состояния авторизации
    } catch (err) {
      console.error("Ошибка при отправке формы:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12 bg-gray-50">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Входи в аккаунт</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={!form.username || !form.password || loading}
            className={`w-full rounded-md px-4 py-2 font-semibold text-white shadow-sm ${
              form.username && form.password && !loading
                ? "bg-indigo-600 hover:bg-indigo-500"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {loading ? "Загрузка..." : "Войти"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Еще не зарегистрирован?{" "}
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            Сделай это!
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
