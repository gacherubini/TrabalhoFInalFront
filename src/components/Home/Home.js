import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1 className="main-header">Gerenciamento de Sistema de Controle de Assinaturas de Aplicativos</h1>
      <div className="cards-container">
        <Link to="/clientes" className="card">
          <img src="/icons/customer.png" alt="Gerenciar Clientes" />
          <h2>Gerenciar Clientes</h2>
        </Link>
        <Link to="/aplicativos" className="card">
          <img src="/icons/application.png" alt="Gerenciar Aplicativos" />
          <h2>Gerenciar Aplicativos</h2>
        </Link>
        <Link to="/assinaturas" className="card">
          <img src="/icons/subscription.png" alt="Gerenciar Assinaturas" />
          <h2>Gerenciar Assinaturas</h2>
        </Link>
        <Link to="/pagamentos" className="card">
          <img src="/icons/payment.png" alt="Gerenciar Pagamentos" />
          <h2>Gerenciar Pagamentos</h2>
        </Link>
        <Link to="/usuarios" className="card">
          <img src="/icons/user.png" alt="Gerenciar Usuários" />
          <h2>Gerenciar Usuários</h2>
        </Link>
        <Link to="/promocoes" className="card">
          <img src="/icons/promotion.png"  alt="Gerenciar Promoções" />
          <h2>Gerenciar Promoções</h2>
        </Link>
      </div>
    </div>
  );
}

export default Home;
