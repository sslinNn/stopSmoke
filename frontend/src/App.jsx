import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';

import store from "./redux/store";
import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import Home from "./pages/Home";
// import RegisterForm from "./pages/RegisterForm";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={"<RegisterForm />"} />
          </Routes>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
