import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Usuario.css';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState({ usuario: '', senha: '' });
  const [editMode, setEditMode] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/usuarios');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setUsuarios(data);
        } else {
          setError('Os dados recebidos não são um array');
        }
      } else {
        setError(`Falha ao buscar usuários, status: ${response.status}`);
      }
    } catch (error) {
      setError(`Erro na requisição de usuários: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const saveOrUpdateUsuario = async () => {
    if (!usuario.usuario || !usuario.senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    const method = editMode ? 'PUT' : 'POST';
    const endpoint = editMode ? `https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/usuarios/${usuarioId}` : 'https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/usuarios';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUsuarios(prev =>
          editMode
            ? prev.map(u => (u.id === updatedUser.id ? updatedUser : u))
            : [...prev, updatedUser]
        );
        setUsuario({ usuario: '', senha: '' });
        setEditMode(false);
        setUsuarioId(null);
        setSuccess('Usuário salvo com sucesso!');
        setError('');
      } else {
        setError(`Falha ao salvar usuário, status: ${response.status}`);
      }
    } catch (error) {
      setError(`Erro ao salvar usuário: ${error.message}`);
    }
  };

  const editUsuario = (id) => {
    const user = usuarios.find(u => u.id === id);
    setEditMode(true);
    setUsuarioId(id);
    setUsuario({ usuario: user.usuario, senha: user.senha });
  };

  const deleteUsuario = async (id) => {
    if (!window.confirm('Deseja realmente excluir este usuário?')) return;
    try {
      const response = await fetch(`https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/usuarios/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setUsuarios(usuarios.filter(u => u.id !== id));
        setSuccess('Usuário deletado com sucesso!');
        setError('');
      } else {
        setError(`Falha ao deletar usuário, status: ${response.status}`);
      }
    } catch (error) {
      setError(`Erro ao deletar usuário: ${error.message}`);
    }
  };

  return (
    <div className="usuarios-container">
      <h1 className="header">Gerenciar Usuários</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <div className="form-group">
        <label>Usuário</label>
        <input
          type="text"
          name="usuario"
          value={usuario.usuario}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Nome do usuário"
        />
      </div>
      <div className="form-group">
        <label>Senha</label>
        <input
          type="password"
          name="senha"
          value={usuario.senha}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Senha do usuário"
        />
      </div>
      <button className="button" onClick={saveOrUpdateUsuario}>
        {editMode ? 'Atualizar Usuário' : 'Adicionar Usuário'}
      </button>
      <button className="button cancel" onClick={() => navigate('/')}>Voltar</button>
      <h2 className="header">Lista de Usuários</h2>
      <ul className="usuarios-list">
        {usuarios.map(user => (
          <li key={user.id} className="list-item">
            <span>{user.usuario}</span>
            <div className="button-group">
              <button className="button button-edit" onClick={() => editUsuario(user.id)}>Editar</button>
              <button className="button button-delete" onClick={() => deleteUsuario(user.id)}>Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Usuarios;
