import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './Promocao.css';

function Promocoes() {
  const [promocoes, setPromocoes] = useState([]);
  const [promocao, setPromocao] = useState({ descricao: '', diasExtras: 0, desconto: 0, validade: '', ativa: true });
  const [editMode, setEditMode] = useState(false);
  const [promocaoId, setPromocaoId] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    fetchPromocoes();
  }, []);

  const fetchPromocoes = async () => {
    const response = await fetch('http://localhost:8080/promocoes');
    const data = await response.json();
    setPromocoes(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPromocao(prev => ({ ...prev, [name]: value }));
  };

  const saveOrUpdatePromocao = async () => {
    const method = editMode ? 'PUT' : 'POST';
    const endpoint = editMode ? `http://localhost:8080/promocoes/${promocaoId}` : 'http://localhost:8080/promocoes';

    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promocao)
    });

    if (response.ok) {
      const updatedPromocao = await response.json();
      setPromocoes(editMode ? promocoes.map(p => p.id === updatedPromocao.id ? updatedPromocao : p) : [...promocoes, updatedPromocao]);
      setEditMode(false);
      setPromocaoId(null);
      setPromocao({ descricao: '', diasExtras: 0, desconto: 0, validade: '', ativa: true });
    } else {
      alert('Falha ao salvar promoção');
    }
  };

  const editPromocao = (id) => {
    const promo = promocoes.find(p => p.id === id);
    setEditMode(true);
    setPromocaoId(id);
    setPromocao({ ...promo, validade: promo.validade.split('T')[0] });
  };

  const deletePromocao = async (id) => {
    if (!window.confirm('Deseja realmente excluir esta promoção?')) return;

    const response = await fetch(`http://localhost:8080/promocoes/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      setPromocoes(promocoes.filter(p => p.id !== id));
    } else {
      alert('Falha ao deletar promoção');
    }
  };

  return (
    <div className="promocoes-container">
      <h1 className="header">Gerenciar Promoções</h1>
      <div className="form-group">
        <label>Descrição da Promoção</label>
        <input type="text" className="input-field" name="descricao" value={promocao.descricao} onChange={handleInputChange} placeholder="Descrição da Promoção" />
      </div>
      <div className="form-group">
        <label>Dias Extras</label>
        <input type="number" className="input-field" name="diasExtras" value={promocao.diasExtras} onChange={handleInputChange} placeholder="Dias Extras" />
      </div>
      <div className="form-group">
        <label>Desconto (%)</label>
        <input type="number" className="input-field" name="desconto" value={promocao.desconto} onChange={handleInputChange} placeholder="Desconto (%)" />
      </div>
      <div className="form-group">
        <label>Validade</label>
        <input type="date" className="input-field" name="validade" value={promocao.validade} onChange={handleInputChange} placeholder="Validade da Promoção" />
      </div>
      <div className="form-group">
        <label>
          Ativa:
          <input type="checkbox" name="ativa" checked={promocao.ativa} onChange={(e) => setPromocao(prev => ({ ...prev, ativa: e.target.checked }))} />
        </label>
      </div>
      <button className="button" onClick={saveOrUpdatePromocao}>{editMode ? 'Atualizar Promoção' : 'Adicionar Promoção'}</button>
      <button onClick={() => navigate('/')}>Voltar</button>

      <ul className="promocoes-list">
        {promocoes.map(promo => (
          <li key={promo.id} className="list-item">
            Descrição: {promo.descricao}, Dias Extras: {promo.diasExtras}, Desconto: {promo.desconto}%, Validade: {new Date(promo.validade).toLocaleDateString()}, Ativa: {promo.ativa ? 'Sim' : 'Não'}
            <button className="button" onClick={() => editPromocao(promo.id)}>Editar</button>
            <button className="button" onClick={() => deletePromocao(promo.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Promocoes;
