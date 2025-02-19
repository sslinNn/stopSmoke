// src/index.jsx
import './index.css';
import App from './App.jsx';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store.js'; // Импортируем store и persistor

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>  {/* Оборачиваем в Provider для доступа к Redux */}
    <PersistGate loading={null} persistor={persistor}> {/* Ждем восстановления состояния */}
      <App />
    </PersistGate>
  </Provider>
);
