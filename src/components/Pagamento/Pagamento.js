import React, { useState, useEffect } from 'react';
import './Pagamento.css'; 
import { useNavigate } from 'react-router-dom';

function Pagamentos() {
  const [pagamentos, setPagamentos] = useState([]);
  const [promocoes, setPromocoes] = useState([]);
  const [assinaturas, setAssinaturas] = useState([]);
  const [pagamento, setPagamento] = useState({ valorPago: 0, codPromocao: null, codass: null });
  const [dataPagamento, setDataPagamento] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
      const response = await fetch('https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/pagamentos');
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
      const response = await fetch('https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/promocoes');
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
      const response = await fetch('https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/assinaturas');
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

  const savePagamento = async () => {
    if (!dataPagamento) {
      setError('Por favor, insira uma data válida.');
      return;
    }

    const [ano, mes, dia] = dataPagamento.split('-');

    const pagamentoData = {
      ...pagamento,
      dia: parseInt(dia),
      mes: parseInt(mes),
      ano: parseInt(ano)
    };

    try {
      const response = await fetch('https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/registrarpagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pagamentoData)
      });

      if (response.ok) {
        const updatedPagamento = await response.json();
        setPagamentos([...pagamentos, updatedPagamento]);
        setPagamento({ valorPago: 0, codPromocao: null, codass: null });
        setDataPagamento('');
        setError('');
        setSuccess('Pagamento salvo com sucesso!');
      } else {
        setError('Falha ao salvar pagamento');
      }
    } catch (error) {
      console.error('Erro ao salvar pagamento:', error);
      setError('Erro ao salvar pagamento');
    }
  };

  const deletePagamento = async (id) => {
    if (!window.confirm('Deseja realmente excluir este pagamento?')) return;

    try {
      const response = await fetch(`https://trabalho-final-b31a5e4858be.herokuapp.com/servcad/pagamentos/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setPagamentos(pagamentos.filter(p => p.id !== id));
        setSuccess('Pagamento deletado com sucesso!');
      } else {
        setError('Falha ao deletar pagamento');
      }
    } catch (error) {
      console.error('Erro ao deletar pagamento:', error);
      setError('Erro ao deletar pagamento');
    }
  };

  return (
    <div className="pagamentos-container">
      <h1 className="header">Gerenciar Pagamentos</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
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
      <button className="button" onClick={savePagamento}>Adicionar Pagamento</button>
      <button className="button cancel" onClick={() => navigate('/')}>Voltar</button>

      <ul className="pagamentos-list">
        {Array.isArray(pagamentos) && pagamentos.length > 0 ? pagamentos.map(pag => (
          <li key={pag.id} className="list-item">
            Valor: {pag.valorPago}, Data: {new Date(pag.dataPagamento).toLocaleDateString()}, Promoção: {pag.promocao ? pag.promocao.descricao : 'Nenhuma'}
            <div className="button-group">
              <button className="button button-delete" onClick={() => deletePagamento(pag.id)}>Deletar</button>
            </div>
          </li>
        )) : <p>Nenhum pagamento encontrado.</p>}
      </ul>
    </div>
  );
}

export default Pagamentos;
