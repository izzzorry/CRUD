import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ItemsContainer from './componentes/itemsContainer';
import Crea from './componentes/crea';
import Edita from './componentes/edita';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ItemsContainer />} />
        <Route path="/crear" element={<Crea />} />
        <Route path="/editar/:id" element={<Edita />} />
      </Routes>
    </Router>
  );
}

export default App;
