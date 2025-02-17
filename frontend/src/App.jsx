import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LoginForm from "./pages/LoginForm";
// import RegisterForm from "./pages/RegisterForm";
import Home from "./pages/Home";

function App() {
  if (status === "loading") return <p>Загрузка...</p>;

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        {/* <Route path="/register" element={<RegisterForm />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
