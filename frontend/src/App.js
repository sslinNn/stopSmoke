import React from 'react';
import './App.css';
import Header from './components/Header/Header'

// function App() {
//   return (
//     <div className="app">
//       <div className="container">
//         <h1 className="text-center mt-10">Привет, мир!</h1>
//         <button className="btn btn-primary">Кнопка Bootstrap</button>
//       </div>
//     </div>
//   );
// }

function App(){
    return (
        <header>
            <Header />
        </header>

    );
}

export default App;