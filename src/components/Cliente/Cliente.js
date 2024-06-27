import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Cliente.css'; 

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate(); 

  const fetchClientes = async () => {
    try {
      const response = await fetch('https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/clientes');
      if (response.ok) {
        const data = await response.json();
        setClientes(data);
      } else {
        throw new Error('Erro ao buscar clientes');
      }
    } catch (error) {
      console.error(error);
      console.error(error.message);
      setErro('Erro ao buscar clientes');
      toast.error('Erro ao buscar clientes');
    }
  };

  const handleAddCliente = async () => {
    const cliente = { nome, email };
    try {
      const response = await fetch('https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
      });
      
      if (response.ok) {
        toast.success('Cliente adicionado com sucesso!');
        fetchClientes(); 
      } else {
        throw new Error('Erro ao adicionar cliente');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao adicionar cliente');
    }
  };

  const handleUpdateCliente = async (id) => {
    const cliente = { nome, email };
    try {
      const response = await fetch(`https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
      });

      if (response.ok) {
        toast.success('Cliente atualizado com sucesso!');
        fetchClientes();
      } else {
        throw new Error('Erro ao atualizar cliente');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar cliente');
    }
  };

  const handleDeleteCliente = async (id) => {
    try {
      const response = await fetch(`https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/clientes/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Cliente deletado com sucesso!');
        fetchClientes(); 
      } else {
        throw new Error('Erro ao deletar cliente');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao deletar cliente');
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <div className="clientes-container">
      <ToastContainer />
      <h1>Clientes</h1>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleAddCliente}>Adicionar Cliente</button>
      <button onClick={() => navigate('/')}>Voltar</button>
      <h2>Lista de Clientes</h2>
      <ul>
        {clientes.map(cliente => (
          <li key={cliente.id}>
            <span>{cliente.nome} - {cliente.email}</span>
            <div className="button-group">
              <button className="button" onClick={() => handleUpdateCliente(cliente.id)}>Editar</button>
              <button className="button" onClick={() => handleDeleteCliente(cliente.id)}>Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Clientes;
