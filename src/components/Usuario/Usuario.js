import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState({ nome: '', email: '' });
  const [editMode, setEditMode] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:8080/servcad/usuarios');
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        console.error('Falha ao buscar usuários');
      }
    } catch (error) {
      console.error('Erro na requisição de usuários:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const saveOrUpdateUsuario = async () => {
    if (!usuario.nome || !usuario.email) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    const method = editMode ? 'PUT' : 'POST';
    const endpoint = editMode ? `http://localhost:8080/servcad/usuarios/${usuarioId}` : 'http://localhost:8080/servcad/usuarios';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUsuarios(editMode ? usuarios.map(u => u.id === updatedUser.id ? updatedUser : u) : [...usuarios, updatedUser]);
        setUsuario({ nome: '', email: '' });
        setEditMode(false);
        setUsuarioId(null);
      } else {
        console.error('Falha ao salvar usuário');
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const editUsuario = (id) => {
    const user = usuarios.find(u => u.id === id);
    setEditMode(true);
    setUsuarioId(id);
    setUsuario({ nome: user.nome, email: user.email });
  };

  const deleteUsuario = async (id) => {
    if (!window.confirm('Deseja realmente excluir este usuário?')) return;
    try {
      const response = await fetch(`http://localhost:8080/servcad/usuarios/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setUsuarios(usuarios.filter(u => u.id !== id));
      } else {
        console.error('Falha ao deletar usuário');
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  return (
    <div>
      <h1>Gerenciar Usuários</h1>
      <div>
        <input
          type="text"
          name="nome"
          value={usuario.nome}
          onChange={handleInputChange}
          placeholder="Nome do usuário"
        />
        <input
          type="email"
          name="email"
          value={usuario.email}
          onChange={handleInputChange}
          placeholder="Email do usuário"
        />
        <button onClick={saveOrUpdateUsuario}>
          {editMode ? 'Atualizar Usuário' : 'Adicionar Usuário'}
        </button>
        <button onClick={() => navigate('/')}>Voltar</button>
      </div>
      <ul>
        {usuarios.map(user => (
          <li key={user.id}>
            {user.nome} ({user.email})
            <button onClick={() => editUsuario(user.id)}>Editar</button>
            <button onClick={() => deleteUsuario(user.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Usuarios;
