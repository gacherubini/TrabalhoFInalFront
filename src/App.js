import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Clientes from './components/Cliente/Cliente';
import Aplicativos from './components/Aplicativo/Aplicativos';
import Assinatura from './components/Assinatura/Assinatura';
import Pagamento from './components/Pagamento/Pagamento';
import Usuario from './components/Usuario/Usuario';
import Promocao from './components/Promocao/Promocao';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/aplicativos" element={<Aplicativos />} />
          <Route path="/assinaturas" element={<Assinatura />} />
          <Route path="/pagamentos" element={<Pagamento />} />
          <Route path="/usuarios" element={<Usuario />} />
          <Route path="/promocoes" element={<Promocao />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
