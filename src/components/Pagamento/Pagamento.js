import React, { useState, useEffect } from 'react';
import './Pagamento.css'; 
import { useNavigate } from 'react-router-dom';


function Pagamentos() {
  const [pagamentos, setPagamentos] = useState([]);
  const [promocoes, setPromocoes] = useState([]);
  const [assinaturas, setAssinaturas] = useState([]);
  const [pagamento, setPagamento] = useState({ valorPago: 0, codPromocao: null, codass: null });
  const [editMode, setEditMode] = useState(false);
  const [pagamentoId, setPagamentoId] = useState(null);
  const [dataPagamento, setDataPagamento] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    fetchPagamentos();
    fetchPromocoes();
    fetchAssinaturas();
  }, []);

  useEffect(() => {
    calcularValorPagamento();
  }, [pagamento.codPromocao, pagamento.codass]);

  const fetchPagamentos = async () => {
    try {
      const response = await fetch('http://localhost:8080/servcad/pagamentos');
      const data = await response.json();
      if (Array.isArray(data)) {
        setPagamentos(data);
      } else {
        setPagamentos([]);
      }
    } catch (error) {
      console.error('Erro na requisição de pagamentos:', error);
      setPagamentos([]);
    }
  };

  const fetchPromocoes = async () => {
    try {
      const response = await fetch('http://localhost:8080/promocoes');
      const data = await response.json();
      if (Array.isArray(data)) {
        setPromocoes(data);
      } else {
        setPromocoes([]);
      }
    } catch (error) {
      console.error('Erro na requisição de promoções:', error);
      setPromocoes([]);
    }
  };

  const fetchAssinaturas = async () => {
    try {
      const response = await fetch('http://localhost:8080/servcad/assinaturas');
      const data = await response.json();
      if (Array.isArray(data)) {
        setAssinaturas(data);
      } else {
        setAssinaturas([]);
      }
    } catch (error) {
      console.error('Erro na requisição de assinaturas:', error);
      setAssinaturas([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPagamento(prev => ({ ...prev, [name]: value }));
  };

  const handlePromocaoChange = (e) => {
    const promocaoId = e.target.value;
    setPagamento(prev => ({
      ...prev,
      codPromocao: promocaoId
    }));
  };

  const handleAssinaturaChange = (e) => {
    const assinaturaId = e.target.value;
    setPagamento(prev => ({
      ...prev,
      codass: assinaturaId
    }));
  };

  const calcularValorPagamento = () => {
    const assinatura = assinaturas.find(a => a.id === parseInt(pagamento.codass));
    const promocao = promocoes.find(p => p.id === parseInt(pagamento.codPromocao));
    
    if (assinatura) {
      let valorOriginal = assinatura.aplicativo.custoMensal;
      if (promocao) {
        valorOriginal = valorOriginal - (valorOriginal * (promocao.desconto / 100));
      }
      setPagamento(prev => ({
        ...prev,
        valorPago: valorOriginal
      }));
    }
  };

  const saveOrUpdatePagamento = async () => {
    if (!dataPagamento) {
      alert('Por favor, insira uma data válida.');
      return;
    }

    const method = editMode ? 'PUT' : 'POST';
    const endpoint = editMode ? `http://localhost:8080/servcad/pagamentos/${pagamentoId}` : 'http://localhost:8080/servcad/pagamentos';

    const pagamentoData = {
      ...pagamento,
      dataPagamento: new Date(dataPagamento).toISOString().split('T')[0]
    };

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pagamentoData)
      });

      if (response.ok) {
        const updatedPagamento = await response.json();
        setPagamentos(editMode ? pagamentos.map(p => p.id === updatedPagamento.id ? updatedPagamento : p) : [...pagamentos, updatedPagamento]);
        setEditMode(false);
        setPagamentoId(null);
        setPagamento({ valorPago: 0, codPromocao: null, codass: null });
        setDataPagamento('');
      } else {
        alert('Falha ao salvar pagamento');
      }
    } catch (error) {
      console.error('Erro ao salvar pagamento:', error);
      alert('Erro ao salvar pagamento');
    }
  };

  const editPagamento = (id) => {
    const pag = pagamentos.find(p => p.id === id);
    setEditMode(true);
    setPagamentoId(id);
    setPagamento(pag);
    setDataPagamento(pag.dataPagamento);
  };

  const deletePagamento = async (id) => {
    if (!window.confirm('Deseja realmente excluir este pagamento?')) return;

    try {
      const response = await fetch(`http://localhost:8080/servcad/pagamentos/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setPagamentos(pagamentos.filter(p => p.id !== id));
      } else {
        alert('Falha ao deletar pagamento');
      }
    } catch (error) {
      console.error('Erro ao deletar pagamento:', error);
      alert('Erro ao deletar pagamento');
    }
  };

  return (
    <div className="pagamentos-container">
      <h1 className="header">Gerenciar Pagamentos</h1>
      <div className="form-group">
        <label>Assinatura</label>
        <select className="input-field" name="codass" value={pagamento.codass || ''} onChange={handleAssinaturaChange}>
          <option value="">Selecione uma Assinatura</option>
          {assinaturas.map(assinatura => (
            <option key={assinatura.id} value={assinatura.id}>{assinatura.cliente.nome} - {assinatura.aplicativo.nome}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Promoção</label>
        <select className="input-field" name="codPromocao" value={pagamento.codPromocao || ''} onChange={handlePromocaoChange}>
          <option value="">Selecione uma Promoção</option>
          {promocoes.map(promocao => (
            <option key={promocao.id} value={promocao.id}>{promocao.descricao}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Valor do Pagamento</label>
        <input type="number" className="input-field" name="valorPago" value={pagamento.valorPago} readOnly />
      </div>
      <div className="form-group">
        <label>Data do Pagamento</label>
        <input type="date" className="input-field" name="dataPagamento" value={dataPagamento} onChange={e => setDataPagamento(e.target.value)} />
      </div>
      <button className="button" onClick={saveOrUpdatePagamento}>{editMode ? 'Atualizar Pagamento' : 'Adicionar Pagamento'}</button>
      <button onClick={() => navigate('/')}>Voltar</button>

      <ul className="pagamentos-list">
        {Array.isArray(pagamentos) && pagamentos.length > 0 ? pagamentos.map(pag => (
          <li key={pag.id} className="list-item">
            Valor: {pag.valorPago}, Data: {new Date(pag.dataPagamento).toLocaleDateString()}, Promoção: {pag.promocao ? pag.promocao.descricao : 'Nenhuma'}
            <button className="button" onClick={() => editPagamento(pag.id)}>Editar</button>
            <button className="button" onClick={() => deletePagamento(pag.id)}>Deletar</button>
          </li>
        )) : <p>Nenhum pagamento encontrado.</p>}
      </ul>
    </div>
  );
}

export default Pagamentos;
