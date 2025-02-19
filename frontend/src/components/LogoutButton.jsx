import {useDispatch} from "react-redux";
import {logout} from "../store/auth/authSlice.js";

const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());

    // Здесь можно также выполнить дополнительные действия (например, очистка cookies или перенаправление)
    // Пример: удалить токен из cookies или localStorage

    document.cookie = "access_token=; ";
    window.location.href = "/";
  };

  return (
    <button className="btn btn-primary" onClick={handleLogout}>
      Quit
    </button>
  );
};

export default LogoutButton;