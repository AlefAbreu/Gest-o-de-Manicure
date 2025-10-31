
import React, { useMemo } from 'react';
import { VendaCaixa, Servico, InsumoEstoque, ServicePriceDetails } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardViewProps {
  vendas: VendaCaixa[];
  servicos: Servico[];
  insumos: InsumoEstoque[];
  priceDetailsMap: Map<string, ServicePriceDetails>;
}

const DashboardView: React.FC<DashboardViewProps> = ({ vendas, servicos, priceDetailsMap }) => {
    
    const kpis = useMemo(() => {
        const totalRevenue = vendas.reduce((acc, v) => acc + v.valorCobrado, 0);
        const totalServices = vendas.length;
        const averageTicket = totalServices > 0 ? totalRevenue / totalServices : 0;
        return { totalRevenue, totalServices, averageTicket };
    }, [vendas]);

    const salesByMonth = useMemo(() => {
        const months: { [key: string]: number } = {};
        vendas.forEach(venda => {
            const month = new Date(venda.dataVenda).toLocaleString('default', { month: 'short', year: '2-digit' });
            if (!months[month]) {
                months[month] = 0;
            }
            months[month] += venda.valorCobrado;
        });
        return Object.entries(months).map(([name, revenue]) => ({ name, Faturamento: revenue })).reverse();
    }, [vendas]);

    const topServicesByRevenue = useMemo(() => {
        const serviceRevenue: { [key: string]: { name: string, revenue: number } } = {};
        vendas.forEach(venda => {
            const service = servicos.find(s => s.servicoId === venda.servicoId);
            if(service) {
                if(!serviceRevenue[service.servicoId]) {
                    serviceRevenue[service.servicoId] = { name: service.nomeServico, revenue: 0 };
                }
                serviceRevenue[service.servicoId].revenue += venda.valorCobrado;
            }
        });
        return Object.values(serviceRevenue).sort((a, b) => b.revenue - a.revenue).slice(0, 3);
    }, [vendas, servicos]);

    const serviceProfitability = useMemo(() => {
        return servicos.map(service => {
            const details = priceDetailsMap.get(service.servicoId);
            return {
                name: service.nomeServico,
                "Margem/Hora": details ? details.margemContribuicaoHora : 0
            };
        }).sort((a, b) => b["Margem/Hora"] - a["Margem/Hora"]);
    }, [servicos, priceDetailsMap]);

    return (
        <div className="space-y-8 pb-20 md:pb-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-500">Faturamento Total</h3>
                    <p className="text-4xl font-bold text-green-600 mt-2">{kpis.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-500">Serviços Prestados</h3>
                    <p className="text-4xl font-bold text-blue-600 mt-2">{kpis.totalServices}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-500">Ticket Médio</h3>
                    <p className="text-4xl font-bold text-purple-600 mt-2">{kpis.averageTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Faturamento Mensal</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesByMonth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `R$${value}`}/>
                            <Tooltip formatter={(value: number) => [value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), "Faturamento"]}/>
                            <Legend />
                            <Bar dataKey="Faturamento" fill="#ec4899" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Rentabilidade por Serviço (Margem/Hora)</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={serviceProfitability} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tickFormatter={(value) => `R$${value}`} />
                            <YAxis dataKey="name" type="category" width={120} />
                            <Tooltip formatter={(value: number) => [value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), "Margem/Hora"]}/>
                            <Bar dataKey="Margem/Hora" fill="#8b5cf6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Top 3 Serviços por Faturamento</h3>
                <ul className="space-y-3">
                    {topServicesByRevenue.map((service, index) => (
                        <li key={index} className="flex justify-between items-center">
                            <span className="font-medium text-gray-600">{index + 1}. {service.name}</span>
                            <span className="font-bold text-lg text-pink-600">{service.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DashboardView;
