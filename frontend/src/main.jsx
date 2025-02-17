import './index.css'
import App from './App.jsx'
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";


ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider>
    <App />
  </Provider>
);