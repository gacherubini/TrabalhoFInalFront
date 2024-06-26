import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Aplicativos.css';

function Aplicativos() {
  const [aplicativos, setAplicativos] = useState([]);
  const [nome, setNome] = useState('');
  const [custoMensal, setCustoMensal] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/servcad/aplicativos')
      .then(response => response.json())
      .then(data => setAplicativos(data));
  }, []);

  const handleAddAplicativo = async () => {
    const aplicativo = { nome, custoMensal };

    const response = await fetch('http://localhost:8080/servcad/aplicativos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aplicativo),
    });

    if (response.ok) {
      alert('Aplicativo adicionado com sucesso!');
      setNome('');
      setCustoMensal('');
      fetch('http://localhost:8080/servcad/aplicativos')
        .then(response => response.json())
        .then(data => setAplicativos(data));
    } else {
      alert('Erro ao adicionar aplicativo');
    }
  };

  const handleDeleteAplicativo = async (id) => {
    const response = await fetch(`http://localhost:8080/servcad/aplicativos/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
      alert('Aplicativo deletado com sucesso!');
      setAplicativos(aplicativos.filter(aplicativo => aplicativo.id !== id));
    } else {
        console.log(response);
        console.log(response.status);
      alert('Erro ao deletar aplicativo');
    }
  };

  const handleUpdateAplicativo = async (id) => {
    const aplicativo = { nome, custoMensal };

    const response = await fetch(`http://localhost:8080/servcad/aplicativos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aplicativo),
    });

    if (response.ok) {
      alert('Aplicativo atualizado com sucesso!');
      setNome('');
      setCustoMensal('');
      fetch('http://localhost:8080/servcad/aplicativos')
        .then(response => response.json())
        .then(data => setAplicativos(data));
    } else {
      alert('Erro ao atualizar aplicativo');
    }
  };

  return (
    <div>
      <h1>Aplicativos</h1>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="number"
        placeholder="Custo Mensal"
        value={custoMensal}
        onChange={(e) => setCustoMensal(e.target.value)}
      />
      <button onClick={handleAddAplicativo}>Adicionar Aplicativo</button>
      <button onClick={() => navigate('/')}>Voltar</button>
      <h2>Lista de Aplicativos</h2>
      <ul>
        {aplicativos.map((aplicativo) => (
          <li key={aplicativo.id}>
            {aplicativo.nome} - {aplicativo.custoMensal}
            <button onClick={() => handleUpdateAplicativo(aplicativo.id)}>Editar</button>
            <button onClick={() => handleDeleteAplicativo(aplicativo.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Aplicativos;
