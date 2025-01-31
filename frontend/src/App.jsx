import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header"
import LoginForm from "./components/LoginForm.jsx"
import Home from "./pages/Home"

function App() {
  return (
    <div className="App">
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<LoginForm/>}/>
          <Route path="/register" element={"<RegisterForm/>"} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
