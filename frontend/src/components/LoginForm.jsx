import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
// import { login, getUser } from "../store/authSlice";
import {getUser, login} from "../store/auth/authSlice.js"
// import {useNavigate} from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const {error, loading} = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({email, password}));
    if (result.meta.requestStatus === "fulfilled") {
      await dispatch(getUser()); // Загружаем пользователя после логина
      // navigate("/");
    }
  };

  return (
    <div>
      <h2>Вход</h2>
      {error && <p style={{color: "red"}}>{error}</p>}
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)}
               required/>
        <button className="border-2 border-solid w-2/12" type="submit"
                disabled={loading}>{loading ? "Загрузка..." : "Войти"}</button>
      </form>
    </div>
  );
};

export default Login;
