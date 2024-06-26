import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Assinaturas() {
  const [assinaturas, setAssinaturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [aplicativos, setAplicativos] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedAplicativo, setSelectedAplicativo] = useState('');

  const [inicioVigencia, setInicioVigencia] = useState('');
  const [fimVigencia, setFimVigencia] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentAssinaturaId, setCurrentAssinaturaId] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    fetchAssinaturas();
    fetchClientes();
    fetchAplicativos();
  }, []);

  const fetchAssinaturas = async () => {
    try {
      const response = await fetch('http://localhost:8080/servcad/assinaturas');
      if (response.ok) {
        const data = await response.json();
        setAssinaturas(data);
      } else {
        throw new Error('Falha ao buscar assinaturas');
      }
    } catch (error) {
      console.error('Erro na requisição de assinaturas:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await fetch('http://localhost:8080/servcad/clientes'); // Adapte este endpoint conforme necessário
      if (response.ok) {
        const data = await response.json();
        setClientes(data);
      } else {
        throw new Error('Falha ao buscar clientes');
      }
    } catch (error) {
      console.error('Erro na requisição de clientes:', error);
    }
  };

  const fetchAplicativos = async () => {
    try {
      const response = await fetch('http://localhost:8080/servcad/aplicativos'); // Adapte este endpoint conforme necessário
      if (response.ok) {
        const data = await response.json();
        setAplicativos(data);
      } else {
        throw new Error('Falha ao buscar aplicativos');
      }
    } catch (error) {
      console.error('Erro na requisição de aplicativos:', error);
    }
  };

  const handleCreateOrUpdateAssinatura = async () => {
    const payload = {
        clienteId: selectedCliente,
        aplicativoId: selectedAplicativo
    };
    const method = 'POST'; 
    const endpoint = 'http://localhost:8080/servcad/assinaturas';

    try {
        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Assinatura salva com sucesso!');
            fetchAssinaturas();
        } else {
            throw new Error('Erro ao salvar assinatura');
        }
    } catch (error) {
        console.error('Erro ao salvar ou atualizar assinatura:', error);
        alert('Erro ao salvar ou atualizar assinatura');
    }
};

  const handleDeleteAssinatura = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta assinatura?')) {
      try {
        const response = await fetch(`http://localhost:8080/servcad/assinaturas/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('Assinatura deletada com sucesso!');
          fetchAssinaturas(); // Atualiza a lista após a deleção
        } else {
          throw new Error('Falha ao deletar assinatura');
        }
      } catch (error) {
        console.error('Erro ao deletar assinatura:', error);
        alert('Erro ao deletar assinatura');
      }
    }
  };

  const clearForm = () => {
    setSelectedCliente('');
    setSelectedAplicativo('');
    setInicioVigencia('');
    setFimVigencia('');
    setEditMode(false);
    setCurrentAssinaturaId(null);
  };

  const handleEdit = (assinatura) => {
    setEditMode(true);
    setCurrentAssinaturaId(assinatura.id);
    setSelectedCliente(assinatura.cliente.id);
    setSelectedAplicativo(assinatura.aplicativo.id);
    setInicioVigencia(assinatura.inicioVigencia);
    setFimVigencia(assinatura.fimVigencia);
  };

  return (
    <div>
      <h1>Gerenciar Assinaturas</h1>
      <div>
        <select value={selectedCliente} onChange={e => setSelectedCliente(e.target.value)}>
          <option value="">Selecione o Cliente</option>
          {clientes.map(cliente => (
            <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
          ))}
        </select>
        <select value={selectedAplicativo} onChange={e => setSelectedAplicativo(e.target.value)}>
          <option value="">Selecione o Aplicativo</option>
          {aplicativos.map(aplicativo => (
            <option key={aplicativo.id} value={aplicativo.id}>{aplicativo.nome}</option>
          ))}
        </select>
        <input type="date" value={inicioVigencia} onChange={e => setInicioVigencia(e.target.value)} />
        <input type="date" value={fimVigencia} onChange={e => setFimVigencia(e.target.value)} />
        <button onClick={handleCreateOrUpdateAssinatura}>{editMode ? 'Atualizar' : 'Salvar'} Assinatura</button>
        <button onClick={clearForm}>Cancelar</button>
        <button onClick={() => navigate('/')}>Voltar</button>

      </div>
      <h2>Lista de Assinaturas</h2>
      <ul>
        {assinaturas.map(assinatura => (
          <li key={assinatura.id}>
            Cliente: {assinatura.cliente.nome}, Aplicativo: {assinatura.aplicativo.nome}, Início: {assinatura.inicioVigencia}, Fim: {assinatura.fimVigencia}
            <button onClick={() => handleEdit(assinatura)}>Editar</button>
            <button onClick={() => handleDeleteAssinatura(assinatura.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Assinaturas;
