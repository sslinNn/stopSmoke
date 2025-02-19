import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "antd/es/form/Form.js";
import {useSelector} from "react-redux";


const Register = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ passwordConfirm, setPasswordConfirm ] = useState('');
  // const navigate = useNavigate();
  const {error, loading} = useSelector((state) => state.auth);
}


function RegisterForm() {
  return (
    <div>
      <h2>Вход</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="border-2 border-solid w-2/12" type="submit" disabled={loading}>{loading ? "Загрузка..." : "Войти"}</button>
      </form>
    </div>
  );
}

export default RegisterForm;