import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  InsumoEstoque,
  Servico,
  ComposicaoServico,
  VendaCaixa,
  Cliente,
  CustoOperacional,
  AtivoFixo,
  ServicePriceDetails,
  TipoCusto,
} from './types';
import {
  INITIAL_INSUMOS,
  INITIAL_SERVICOS,
  INITIAL_COMPOSICOES,
  INITIAL_VENDAS,
  INITIAL_CLIENTES,
  INITIAL_CUSTOS_OPERACIONAIS,
  INITIAL_ATIVOS_FIXOS,
} from './constants';
import Header from './components/Header';
import CaixaView from './components/CaixaView';
import EstoqueView from './components/EstoqueView';
import ServicosView from './components/ServicosView';
import DashboardView from './components/DashboardView';
import ClientesView from './components/ClientesView';
import AgendaView from './components/AgendaView';
import CustosView from './components/CustosView';
import SettingsView from './components/SettingsView';

function App() {
  // State Management
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [insumos, setInsumos] = useState<InsumoEstoque[]>(INITIAL_INSUMOS);
  const [servicos, setServicos] = useState<Servico[]>(INITIAL_SERVICOS);
  const [composicoes, setComposicoes] = useState<ComposicaoServico[]>(INITIAL_COMPOSICOES);
  const [vendas, setVendas] = useState<VendaCaixa[]>(INITIAL_VENDAS);
  const [clientes, setClientes] = useState<Cliente[]>(INITIAL_CLIENTES);
  const [custosOperacionais, setCustosOperacionais] = useState<CustoOperacional[]>(INITIAL_CUSTOS_OPERACIONAIS);
  const [ativosFixos, setAtivosFixos] = useState<AtivoFixo[]>(INITIAL_ATIVOS_FIXOS);
  const [horasTrabalhadasMes, setHorasTrabalhadasMes] = useState<number>(160); // Default 40h/semana

  // Business Logic & Calculations
  const priceDetailsMap = useMemo(() => {
    const detailsMap = new Map<string, ServicePriceDetails>();

    const totalCustosFixosMensais = custosOperacionais
      .filter(c => c.tipoCusto === TipoCusto.Fixo)
      .reduce((acc, custo) => acc + custo.valorMensal, 0);

    const totalCustosVariaveisMensais = custosOperacionais
      .filter(c => c.tipoCusto === TipoCusto.Variavel)
      .reduce((acc, custo) => acc + custo.valorMensal, 0);

    const totalHorasTrabalhadasMes = horasTrabalhadasMes;
    const custoHoraFixo = totalHorasTrabalhadasMes > 0 ? totalCustosFixosMensais / totalHorasTrabalhadasMes : 0;
    const custoHoraVariavel = totalHorasTrabalhadasMes > 0 ? totalCustosVariaveisMensais / totalHorasTrabalhadasMes : 0;

    servicos.forEach(servico => {
      const tempoEmHoras = servico.tempoEstimadoMinutos / 60;
      const composicoesDoServico = composicoes.filter(c => c.servicoId === servico.servicoId);

      const custoMaterial = composicoesDoServico.reduce((acc, comp) => {
        const insumo = insumos.find(i => i.insumoId === comp.insumoId);
        if (!insumo || insumo.tamanhoEmbalagem === 0) return acc;
        const custoPorUnidade = insumo.custoEmbalagem / insumo.tamanhoEmbalagem;
        return acc + custoPorUnidade * comp.consumoMedioPorServico;
      }, 0);

      const custoAmortizacao = ativosFixos.reduce((acc, ativo) => {
        if (ativo.servicosRelacionados.includes(servico.servicoId) && ativo.vidaUtilHoras > 0) {
          const custoPorHoraAtivo = ativo.custoAquisicao / ativo.vidaUtilHoras;
          return acc + custoPorHoraAtivo * tempoEmHoras;
        }
        return acc;
      }, 0);

      const custoProduto = custoMaterial + custoAmortizacao;
      const precoSugerido = custoProduto * (1 + servico.margemLucroDesejada);

      const rateioCustoFixo = custoHoraFixo * tempoEmHoras;
      const rateioCustoVariavel = custoHoraVariavel * tempoEmHoras;
      const custoTotal = custoMaterial + custoAmortizacao + rateioCustoFixo + rateioCustoVariavel;
      
      const custosVariaveisServico = custoMaterial + custoAmortizacao + rateioCustoVariavel;
      const margemContribuicaoRS = precoSugerido - custosVariaveisServico;
      const margemContribuicaoPercent = precoSugerido > 0 ? (margemContribuicaoRS / precoSugerido) * 100 : 0;
      const margemContribuicaoHora = tempoEmHoras > 0 ? margemContribuicaoRS / tempoEmHoras : 0;

      detailsMap.set(servico.servicoId, {
        custoMaterial,
        custoAmortizacao,
        rateioCustoFixo,
        rateioCustoVariavel,
        custoTotal,
        precoSugerido,
        margemContribuicaoRS,
        margemContribuicaoPercent,
        margemContribuicaoHora,
      });
    });

    return detailsMap;
  }, [servicos, composicoes, insumos, custosOperacionais, ativosFixos, horasTrabalhadasMes]);

  const dashboardMetrics = useMemo(() => {
    const totalCustosFixosMensais = custosOperacionais
      .filter(c => c.tipoCusto === TipoCusto.Fixo)
      .reduce((acc, custo) => acc + custo.valorMensal, 0);
      
    const totalRevenue = vendas.reduce((acc, v) => acc + v.valorCobrado, 0);

    const totalVariableCostsOfSales = vendas.reduce((acc, venda) => {
        const details = priceDetailsMap.get(venda.servicoId);
        if (details) {
            const custoVariavelUnitario = details.custoMaterial + details.custoAmortizacao + details.rateioCustoVariavel;
            return acc + (custoVariavelUnitario * venda.quantidadeServicos);
        }
        return acc;
    }, 0);

    const totalContributionMargin = totalRevenue - totalVariableCostsOfSales;
    const averageContributionMarginRatio = totalRevenue > 0 ? totalContributionMargin / totalRevenue : 0;
    
    const pontoEquilibrioFinanceiro = averageContributionMarginRatio > 0 
      ? totalCustosFixosMensais / averageContributionMarginRatio
      : 0;

    return {
      pontoEquilibrioFinanceiro
    };

  }, [vendas, custosOperacionais, priceDetailsMap]);

  // Handler Functions
  const handleUpdateServico = useCallback((updatedServico: Servico) => {
    setServicos(prev => prev.map(s => s.servicoId === updatedServico.servicoId ? updatedServico : s));
  }, []);
  
  const handleAddVenda = useCallback((newVendaData: Omit<VendaCaixa, 'vendaId' | 'dataVenda'>) => {
    const newVenda: VendaCaixa = {
        ...newVendaData,
        vendaId: `V${Date.now()}`,
        dataVenda: new Date().toISOString(),
    };
    
    // Decrease stock
    const composicoesDoServico = composicoes.filter(c => c.servicoId === newVenda.servicoId);
    setInsumos(prevInsumos => {
        const newInsumos = [...prevInsumos];
        composicoesDoServico.forEach(comp => {
            const insumoIndex = newInsumos.findIndex(i => i.insumoId === comp.insumoId);
            if(insumoIndex !== -1) {
                const consumoEmbalagem = comp.consumoMedioPorServico / newInsumos[insumoIndex].tamanhoEmbalagem;
                newInsumos[insumoIndex].estoqueAtualEmbalagens -= consumoEmbalagem;
            }
        });
        return newInsumos;
    });

    setVendas(prev => [newVenda, ...prev]);
  }, [composicoes]);

  const handleDeleteVenda = useCallback((vendaId: string) => {
    const vendaToDelete = vendas.find(v => v.vendaId === vendaId);
    if (!vendaToDelete) return;

    // Restore stock
    const composicoesDoServico = composicoes.filter(c => c.servicoId === vendaToDelete.servicoId);
     setInsumos(prevInsumos => {
        const newInsumos = [...prevInsumos];
        composicoesDoServico.forEach(comp => {
            const insumoIndex = newInsumos.findIndex(i => i.insumoId === comp.insumoId);
            if(insumoIndex !== -1 && newInsumos[insumoIndex].tamanhoEmbalagem > 0) {
                const consumoEmbalagem = comp.consumoMedioPorServico / newInsumos[insumoIndex].tamanhoEmbalagem;
                newInsumos[insumoIndex].estoqueAtualEmbalagens += consumoEmbalagem;
            }
        });
        return newInsumos;
    });

    setVendas(prev => prev.filter(v => v.vendaId !== vendaId));
  }, [vendas, composicoes]);

  const handleAddInsumo = useCallback((newInsumoData: Omit<InsumoEstoque, 'insumoId'>) => {
    const newInsumo: InsumoEstoque = {
        ...newInsumoData,
        insumoId: `I${Date.now()}`
    };
    setInsumos(prev => [...prev, newInsumo]);
  }, []);

  const handleUpdateInsumo = useCallback((updatedInsumo: InsumoEstoque) => {
    setInsumos(prev => prev.map(i => i.insumoId === updatedInsumo.insumoId ? updatedInsumo : i));
  }, []);

  const handleUpdateComposicoes = useCallback((servicoId: string, updatedComps: ComposicaoServico[]) => {
    setComposicoes(prev => {
        const otherComps = prev.filter(c => c.servicoId !== servicoId);
        return [...otherComps, ...updatedComps];
    });
  }, []);
  
  const handleAddCliente = useCallback((newClienteData: Omit<Cliente, 'clienteId'>) => {
    const newCliente: Cliente = {
        ...newClienteData,
        clienteId: `CLI${Date.now()}`
    };
    setClientes(prev => [...prev, newCliente]);
  }, []);

  const handleUpdateCliente = useCallback((updatedCliente: Cliente) => {
    setClientes(prev => prev.map(c => c.clienteId === updatedCliente.clienteId ? updatedCliente : c));
  }, []);
  
  const handleDeleteCliente = useCallback((clienteId: string) => {
    setClientes(prev => prev.filter(c => c.clienteId !== clienteId));
  }, []);

  const handleAddCusto = useCallback((newCustoData: Omit<CustoOperacional, 'custoId' | 'dataRegistro'>) => {
    const newCusto: CustoOperacional = {
        ...newCustoData,
        custoId: `CO${Date.now()}`,
        dataRegistro: new Date().toISOString()
    };
    setCustosOperacionais(prev => [...prev, newCusto]);
  }, []);

  const handleEditCusto = useCallback((updatedCusto: CustoOperacional) => {
    setCustosOperacionais(prev => prev.map(c => c.custoId === updatedCusto.custoId ? updatedCusto : c));
  }, []);

  const handleDeleteCusto = useCallback((custoId: string) => {
    setCustosOperacionais(prev => prev.filter(c => c.custoId !== custoId));
  }, []);

  const handleClearVendas = useCallback(() => {
    if (window.confirm('TEM CERTEZA? Esta ação irá apagar permanentemente TODO o histórico de vendas. O estoque dos insumos NÃO será restaurado. Esta ação é irreversível.')) {
      setVendas([]);
    }
  }, []);
  
  const handleClearClientes = useCallback(() => {
    if (window.confirm('TEM CERTEZA? Esta ação irá apagar permanentemente TODOS os clientes cadastrados. As vendas associadas a eles NÃO serão apagadas, mas o nome do cliente aparecerá como "Desconhecido". Esta ação é irreversível.')) {
      setClientes([]);
    }
  }, []);
  
  const handleHorasTrabalhadasChange = useCallback((novasHoras: number) => {
    setHorasTrabalhadasMes(novasHoras > 0 ? novasHoras : 1);
  }, []);

  // View Rendering
  const renderView = () => {
    switch (currentView) {
      case View.Caixa:
        return <CaixaView vendas={vendas} clientes={clientes} servicos={servicos} onAddVenda={handleAddVenda} onDeleteVenda={handleDeleteVenda} />;
      case View.Estoque:
        return <EstoqueView insumos={insumos} onAddInsumo={handleAddInsumo} onUpdateInsumo={handleUpdateInsumo} />;
      case View.Servicos:
        return <ServicosView servicos={servicos} priceDetailsMap={priceDetailsMap} composicoes={composicoes} insumos={insumos} onUpdateComposicoes={handleUpdateComposicoes} ativosFixos={ativosFixos} custosOperacionais={custosOperacionais} horasTrabalhadasMes={horasTrabalhadasMes} onHorasTrabalhadasChange={handleHorasTrabalhadasChange} onUpdateServico={handleUpdateServico} />;
      case View.Clientes:
        return <ClientesView clientes={clientes} onAddCliente={handleAddCliente} onUpdateCliente={handleUpdateCliente} onDeleteCliente={handleDeleteCliente} />;
      case View.Agenda:
        return <AgendaView vendas={vendas} clientes={clientes} servicos={servicos} />;
      case View.Custos:
        return <CustosView custos={custosOperacionais} onAddCusto={handleAddCusto} onEditCusto={handleEditCusto} onDeleteCusto={handleDeleteCusto} />;
      case View.Settings:
        return <SettingsView onClearVendas={handleClearVendas} onClearClientes={handleClearClientes} />;
      case View.Dashboard:
        return <DashboardView vendas={vendas} servicos={servicos} insumos={insumos} priceDetailsMap={priceDetailsMap} pontoEquilibrioFinanceiro={dashboardMetrics.pontoEquilibrioFinanceiro} />;
      default:
        return <DashboardView vendas={vendas} servicos={servicos} insumos={insumos} priceDetailsMap={priceDetailsMap} pontoEquilibrioFinanceiro={dashboardMetrics.pontoEquilibrioFinanceiro} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
}

export default App;