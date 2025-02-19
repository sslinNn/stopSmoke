import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from "./components/RegisterForm";
import Home from "./pages/Home";
// import Profile from "./pages/Profile";
import { useSelector } from 'react-redux';

const UserIn = () => {
  const { error, user, status } = useSelector((state) => state.auth);

  if (status === "loading") return <p>Загрузка...</p>;
  if (error) return <p>Error: {error}</p>;

  return user;
};

function App() {
  const user = UserIn();

  return (
    <Router>
      {/*<Header />*/}
      {user && <p>Привет, {user.name}!</p>}
      <Routes>
        {user ? (
          <>
            <Route path="/" element={<Home />} />
            {/*<Route path="/profile" element={<Profile />} />*/}
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
