import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Assinatura.css';

function Assinaturas() {
  const [assinaturas, setAssinaturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [aplicativos, setAplicativos] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedAplicativo, setSelectedAplicativo] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentAssinaturaId, setCurrentAssinaturaId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchAssinaturas();
    fetchClientes();
    fetchAplicativos();
  }, []);

  const fetchAssinaturas = async () => {
    try {
      const response = await fetch('https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/assinaturas');
      if (response.ok) {
        const data = await response.json();
        setAssinaturas(data);
      } else {
        throw new Error('Falha ao buscar assinaturas');
      }
    } catch (error) {
      console.error('Erro na requisição de assinaturas:', error);
      setError('Erro ao buscar assinaturas');
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await fetch('https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/clientes');
      if (response.ok) {
        const data = await response.json();
        setClientes(data);
      } else {
        throw new Error('Falha ao buscar clientes');
      }
    } catch (error) {
      console.error('Erro na requisição de clientes:', error);
      setError('Erro ao buscar clientes');
    }
  };

  const fetchAplicativos = async () => {
    try {
      const response = await fetch('https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/aplicativos');
      if (response.ok) {
        const data = await response.json();
        setAplicativos(data);
      } else {
        throw new Error('Falha ao buscar aplicativos');
      }
    } catch (error) {
      console.error('Erro na requisição de aplicativos:', error);
      setError('Erro ao buscar aplicativos');
    }
  };

  const handleCreateOrUpdateAssinatura = async () => {
    const payload = {
      clienteId: selectedCliente,
      aplicativoId: selectedAplicativo,
    };
    const method = editMode ? 'PUT' : 'POST';
    const endpoint = editMode
      ? `https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/assinaturas/${currentAssinaturaId}`
      : 'https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/assinaturas';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess('Assinatura salva com sucesso!');
        setError('');
        fetchAssinaturas();
        clearForm();
      } else {
        throw new Error('Erro ao salvar assinatura');
      }
    } catch (error) {
      console.error('Erro ao salvar ou atualizar assinatura:', error);
      setError('Erro ao salvar ou atualizar assinatura');
      setSuccess('');
    }
  };

  const handleDeleteAssinatura = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta assinatura?')) {
      try {
        const response = await fetch(`https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/assinaturas/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setSuccess('Assinatura deletada com sucesso!');
          setError('');
          fetchAssinaturas();
        } else {
          throw new Error('Falha ao deletar assinatura');
        }
      } catch (error) {
        console.error('Erro ao deletar assinatura:', error);
        setError('Erro ao deletar assinatura');
        setSuccess('');
      }
    }
  };

  const clearForm = () => {
    setSelectedCliente('');
    setSelectedAplicativo('');
    setEditMode(false);
    setCurrentAssinaturaId(null);
  };

  const handleEdit = (assinatura) => {
    setEditMode(true);
    setCurrentAssinaturaId(assinatura.id);
    setSelectedCliente(assinatura.cliente.id);
    setSelectedAplicativo(assinatura.aplicativo.id);
  };

  return (
    <div className="assinaturas-container">
      <h1 className="header">Gerenciar Assinaturas</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <div>
        <select className="input-field" value={selectedCliente} onChange={(e) => setSelectedCliente(e.target.value)}>
          <option value="">Selecione o Cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>
        <select className="input-field" value={selectedAplicativo} onChange={(e) => setSelectedAplicativo(e.target.value)}>
          <option value="">Selecione o Aplicativo</option>
          {aplicativos.map((aplicativo) => (
            <option key={aplicativo.id} value={aplicativo.id}>
              {aplicativo.nome}
            </option>
          ))}
        </select>
        <button className="button" onClick={handleCreateOrUpdateAssinatura}>{editMode ? 'Atualizar Assinatura' : 'Salvar Assinatura'}</button>
        <button className="button cancel" onClick={clearForm}>Cancelar</button>
        <button className="button cancel" onClick={() => navigate('/')}>Voltar</button>
      </div>
      <h2 className="header">Lista de Assinaturas</h2>
      <ul className="assinaturas-list">
        {assinaturas.map((assinatura) => (
          <li key={assinatura.id} className="list-item">
            Cliente: {assinatura.cliente.nome}, Aplicativo: {assinatura.aplicativo.nome}, Início: {assinatura.inicioVigencia}, Fim: {assinatura.fimVigencia}
            <div className="button-group">
              <button className="button button-edit" onClick={() => handleEdit(assinatura)}>Editar</button>
              <button className="button button-delete" onClick={() => handleDeleteAssinatura(assinatura.id)}>Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Assinaturas;
