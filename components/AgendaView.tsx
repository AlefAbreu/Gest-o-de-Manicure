
import React, { useMemo } from 'react';
import { VendaCaixa, Cliente, Servico } from '../types';

interface AgendaViewProps {
  vendas: VendaCaixa[];
  clientes: Cliente[];
  servicos: Servico[];
}

interface GroupedVendas {
    [key: string]: VendaCaixa[];
}

const AgendaView: React.FC<AgendaViewProps> = ({ vendas, clientes, servicos }) => {

  const getClienteName = (id: string) => clientes.find(c => c.clienteId === id)?.nomeCliente || 'Desconhecido';
  const getServicoName = (id:string) => servicos.find(s => s.servicoId === id)?.nomeServico || 'Desconhecido';

  const groupedVendas = useMemo(() => {
    return vendas.reduce((acc, venda) => {
      const date = new Date(venda.dataVenda).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(venda);
      return acc;
    }, {} as GroupedVendas);
  }, [vendas]);

  const sortedDates = Object.keys(groupedVendas).sort((a, b) => {
    // A bit of a hack to sort dates in BR format (DD/MM/YYYY)
    const [dayA, monthA, yearA] = a.split(' de ');
    const [dayB, monthB, yearB] = b.split(' de ');
    const dateA = new Date(`${yearA}-${new Date(Date.parse(monthA +" 1, 2012")).getMonth()+1}-${dayA}`);
    const dateB = new Date(`${yearB}-${new Date(Date.parse(monthB +" 1, 2012")).getMonth()+1}-${dayB}`);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <h1 className="text-3xl font-bold text-gray-800">Agenda de Visitas</h1>
        {sortedDates.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">Nenhuma visita registrada.</p>
        ) : (
            sortedDates.map(date => (
                <div key={date}>
                    <h2 className="text-xl font-semibold text-pink-600 bg-pink-50 p-3 rounded-t-lg">{date}</h2>
                    <div className="bg-white rounded-b-xl shadow-lg border border-t-0 border-gray-200 overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {groupedVendas[date].map(venda => (
                                <li key={venda.vendaId} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                    <div>
                                        <p className="font-semibold text-gray-800">{getClienteName(venda.clienteId)}</p>
                                        <p className="text-sm text-gray-600">{getServicoName(venda.servicoId)}</p>
                                    </div>
                                    <p className="text-lg font-bold text-gray-800">
                                        {venda.valorCobrado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))
        )}
    </div>
  );
};

export default AgendaView;
