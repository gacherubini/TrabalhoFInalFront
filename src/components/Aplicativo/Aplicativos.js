import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Aplicativos.css';

function Aplicativos() {
  const [aplicativos, setAplicativos] = useState([]);
  const [nome, setNome] = useState('');
  const [custoMensal, setCustoMensal] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAplicativos();
  }, []);

  const fetchAplicativos = async () => {
    try {
      const response = await fetch('https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/aplicativos');
      const data = await response.json();
      setAplicativos(data);
    } catch (error) {
      console.error('Erro ao buscar aplicativos:', error);
      setError('Erro ao buscar aplicativos');
    }
  };

  const handleAddAplicativo = async () => {
    const aplicativo = { nome, custoMensal };

    try {
      const response = await fetch('https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/aplicativos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aplicativo),
      });

      if (response.ok) {
        setSuccess('Aplicativo adicionado com sucesso!');
        setError('');
        setNome('');
        setCustoMensal('');
        fetchAplicativos();
      } else {
        throw new Error('Erro ao adicionar aplicativo');
      }
    } catch (error) {
      console.error('Erro ao adicionar aplicativo:', error);
      setError('Erro ao adicionar aplicativo');
      setSuccess('');
    }
  };

  const handleDeleteAplicativo = async (id) => {
    try {
      const response = await fetch(`https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/aplicativos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Aplicativo deletado com sucesso!');
        setError('');
        setAplicativos(aplicativos.filter(aplicativo => aplicativo.id !== id));
      } else {
        throw new Error('Erro ao deletar aplicativo');
      }
    } catch (error) {
      console.error('Erro ao deletar aplicativo:', error);
      setError('Erro ao deletar aplicativo');
      setSuccess('');
    }
  };

  const handleUpdateAplicativo = async (id) => {
    const aplicativo = { nome, custoMensal };

    try {
      const response = await fetch(`https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/aplicativos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aplicativo),
      });

      if (response.ok) {
        setSuccess('Aplicativo atualizado com sucesso!');
        setError('');
        setNome('');
        setCustoMensal('');
        fetchAplicativos();
      } else {
        throw new Error('Erro ao atualizar aplicativo');
      }
    } catch (error) {
      console.error('Erro ao atualizar aplicativo:', error);
      setError('Erro ao atualizar aplicativo');
      setSuccess('');
    }
  };

  return (
    <div className="aplicativos-container">
      <h1 className="header">Aplicativos</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <div className="form-group">
        <label>Nome</label>
        <input
          type="text"
          className="input-field"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Custo Mensal</label>
        <input
          type="number"
          className="input-field"
          placeholder="Custo Mensal"
          value={custoMensal}
          onChange={(e) => setCustoMensal(e.target.value)}
        />
      </div>
      <button className="button" onClick={handleAddAplicativo}>Adicionar Aplicativo</button>
      <button className="button cancel" onClick={() => navigate('/')}>Voltar</button>
      <h2 className="header">Lista de Aplicativos</h2>
      <ul className="aplicativos-list">
        {aplicativos.map((aplicativo) => (
          <li key={aplicativo.id} className="list-item">
            {aplicativo.nome} - {aplicativo.custoMensal}
            <div className="button-group">
              <button className="button button-edit" onClick={() => handleUpdateAplicativo(aplicativo.id)}>Editar</button>
              <button className="button button-delete" onClick={() => handleDeleteAplicativo(aplicativo.id)}>Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Aplicativos;
