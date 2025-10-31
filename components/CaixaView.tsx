
import React, { useState } from 'react';
import { VendaCaixa, Cliente, Servico, FormaPagamento } from '../types';
import { TrashIcon } from './icons/Icons';

interface CaixaViewProps {
  vendas: VendaCaixa[];
  clientes: Cliente[];
  servicos: Servico[];
  onAddVenda: (newVenda: Omit<VendaCaixa, 'vendaId' | 'dataVenda'>) => void;
  onDeleteVenda: (vendaId: string) => void;
}

const CaixaView: React.FC<CaixaViewProps> = ({ vendas, clientes, servicos, onAddVenda, onDeleteVenda }) => {
  const [clienteId, setClienteId] = useState<string>(clientes[0]?.clienteId || '');
  const [servicoId, setServicoId] = useState<string>(servicos[0]?.servicoId || '');
  const [valorCobrado, setValorCobrado] = useState<string>('');
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>(FormaPagamento.PIX);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || !servicoId || !valorCobrado) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    onAddVenda({
      clienteId,
      servicoId,
      quantidadeServicos: 1,
      valorCobrado: parseFloat(valorCobrado),
      formaPagamento,
    });
    setClienteId(clientes[0]?.clienteId || '');
    setServicoId(servicos[0]?.servicoId || '');
    setValorCobrado('');
    setFormaPagamento(FormaPagamento.PIX);
    setShowForm(false);
  };
  
  const getClienteName = (id: string) => clientes.find(c => c.clienteId === id)?.nomeCliente || 'Desconhecido';
  const getServicoName = (id: string) => servicos.find(s => s.servicoId === id)?.nomeServico || 'Desconhecido';

  const handleDelete = (vendaId: string) => {
      if (window.confirm('Tem certeza que deseja excluir esta venda? Esta ação irá reverter a baixa de estoque dos materiais utilizados.')) {
          onDeleteVenda(vendaId);
      }
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Caixa</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition-colors duration-300 font-semibold"
        >
          {showForm ? 'Cancelar' : 'Nova Venda'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-fade-in-down">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-700">Registrar Nova Venda</h2>
            </div>
            <div>
              <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <select id="cliente" value={clienteId} onChange={(e) => setClienteId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500">
                {clientes.map(c => <option key={c.clienteId} value={c.clienteId}>{c.nomeCliente}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="servico" className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
              <select id="servico" value={servicoId} onChange={(e) => setServicoId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500">
                {servicos.map(s => <option key={s.servicoId} value={s.servicoId}>{s.nomeServico}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-1">Valor Cobrado (R$)</label>
              <input type="number" id="valor" value={valorCobrado} onChange={(e) => setValorCobrado(e.target.value)} placeholder="60.00" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500" />
            </div>
            <div>
              <label htmlFor="pagamento" className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
              <select id="pagamento" value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500">
                {Object.values(FormaPagamento).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition-colors duration-300 font-semibold">Salvar Venda</button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Vendas Recentes</h2>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {vendas.map(venda => (
              <li key={venda.vendaId} className="p-4 flex justify-between items-center hover:bg-gray-50 group">
                <div className="flex-grow">
                  <p className="text-sm font-semibold text-pink-600">{getServicoName(venda.servicoId)}</p>
                  <p className="text-sm text-gray-600">{getClienteName(venda.clienteId)}</p>
                  <p className="text-xs text-gray-400">{new Date(venda.dataVenda).toLocaleString('pt-BR')}</p>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-gray-800">
                        {venda.valorCobrado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full inline-block">{venda.formaPagamento}</p>
                </div>
                <div className="pl-4">
                    <button onClick={() => handleDelete(venda.vendaId)} className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TrashIcon />
                    </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CaixaView;