import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Gerenciamento de Sistema de Controle de Assinaturas de Aplicativos</h1>
      <nav>
        <ul>
          <li>
            <Link to="/clientes">Gerenciar Clientes</Link>
          </li>
          <li>
            <Link to="/aplicativos">Gerenciar Aplicativos</Link>
          </li>
          <li>
            <Link to="/assinaturas">Gerenciar Assinaturas</Link>
          </li>
          <li>
            <Link to="/pagamentos">Gerenciar Pagamentos</Link>
          </li>
          <li>
            <Link to="/usuarios">Gerenciar Usuarios</Link>
          </li>
          <li>
            <Link to="/promocoes">Gerenciar Promocao</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;
