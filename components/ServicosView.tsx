import React, { useState, useEffect } from 'react';
import { Servico, ServicePriceDetails, ComposicaoServico, InsumoEstoque, AtivoFixo, CustoOperacional, TipoCusto } from '../types';
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashIcon, InfoIcon } from './icons/Icons';

interface ServicosViewProps {
  servicos: Servico[];
  priceDetailsMap: Map<string, ServicePriceDetails>;
  composicoes: ComposicaoServico[];
  insumos: InsumoEstoque[];
  onUpdateComposicoes: (servicoId: string, updatedComps: ComposicaoServico[]) => void;
  ativosFixos: AtivoFixo[];
  custosOperacionais: CustoOperacional[];
  horasTrabalhadasMes: number;
  onHorasTrabalhadasChange: (novasHoras: number) => void;
  onUpdateServico: (updatedServico: Servico) => void;
}

interface TooltipContentProps {
  type: 'material' | 'amortizacao' | 'rateioFixo' | 'rateioVariavel';
  service: Servico;
  composicoesDoServico: ComposicaoServico[];
  insumos: InsumoEstoque[];
  ativosFixos: AtivoFixo[];
  custosOperacionais: CustoOperacional[];
}

const TooltipContent: React.FC<TooltipContentProps> = ({ type, service, composicoesDoServico, insumos, ativosFixos, custosOperacionais }) => {
    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const tooltipBaseStyle = "absolute z-20 w-72 p-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg shadow-xl bottom-full mb-2 left-0 transition-opacity duration-200";

    switch (type) {
      case 'material':
        return (
          <div className={tooltipBaseStyle}>
            <h4 className="font-bold mb-2 border-b pb-1">Detalhes do Custo de Material</h4>
            {composicoesDoServico.length === 0 && <p className="text-xs text-gray-500">Nenhum material cadastrado.</p>}
            <ul className="space-y-1 max-h-40 overflow-y-auto">
              {composicoesDoServico.map(comp => {
                const insumo = insumos.find(i => i.insumoId === comp.insumoId);
                if (!insumo || insumo.tamanhoEmbalagem === 0) return null;
                const custoUnitario = insumo.custoEmbalagem / insumo.tamanhoEmbalagem;
                const custoItem = custoUnitario * comp.consumoMedioPorServico;
                return (
                  <li key={comp.composicaoId} className="flex justify-between text-xs">
                    <span className="truncate pr-2">{insumo.nomeInsumo}</span>
                    <span className="font-mono flex-shrink-0">{formatCurrency(custoItem)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      case 'amortizacao':
        const ativosRelacionados = ativosFixos.filter(ativo => ativo.servicosRelacionados.includes(service.servicoId));
        return (
          <div className={tooltipBaseStyle}>
            <h4 className="font-bold mb-2 border-b pb-1">Detalhes da Amortização de Ativos</h4>
            <p className="text-xs text-gray-500 mb-2">Custo do ativo ÷ vida útil em horas × tempo do serviço.</p>
            {ativosRelacionados.length === 0 && <p className="text-xs text-gray-500">Nenhum ativo relacionado.</p>}
            <ul className="space-y-1">
              {ativosRelacionados.map(ativo => {
                const tempoEmHoras = service.tempoEstimadoMinutos / 60;
                const custoPorHoraAtivo = ativo.vidaUtilHoras > 0 ? ativo.custoAquisicao / ativo.vidaUtilHoras : 0;
                const custoAmortizacaoItem = custoPorHoraAtivo * tempoEmHoras;
                return (
                  <li key={ativo.ativoId} className="flex justify-between text-xs">
                    <span>{ativo.nomeAtivo}</span>
                    <span className="font-mono">{formatCurrency(custoAmortizacaoItem)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      case 'rateioFixo':
        const custosFixos = custosOperacionais.filter(c => c.tipoCusto === TipoCusto.Fixo);
        const totalCustosFixosMensais = custosFixos.reduce((acc, custo) => acc + custo.valorMensal, 0);
        return (
          <div className={tooltipBaseStyle}>
            <h4 className="font-bold mb-2 border-b pb-1">Detalhes do Rateio de Custos Fixos</h4>
            <p className="text-xs text-gray-500 mb-2">
              (Total de custos fixos mensais ÷ horas trabalhadas no mês) × tempo do serviço.
            </p>
            <div className="flex justify-between text-xs font-semibold border-b mb-1 pb-1">
                <span>Total de Custos Fixos Mensais:</span>
                <span className="font-mono">{formatCurrency(totalCustosFixosMensais)}</span>
            </div>
            <ul className="space-y-1 max-h-24 overflow-y-auto">
              {custosFixos.map(custo => (
                <li key={custo.custoId} className="flex justify-between text-xs">
                  <span className="truncate pr-2">{custo.descricaoCusto}</span>
                  <span className="font-mono flex-shrink-0">{formatCurrency(custo.valorMensal)}</span>
                </li>
              ))}
            </ul>
          </div>
        );
       case 'rateioVariavel':
        const custosVariaveis = custosOperacionais.filter(c => c.tipoCusto === TipoCusto.Variavel);
        const totalCustosVariaveisMensais = custosVariaveis.reduce((acc, custo) => acc + custo.valorMensal, 0);
        return (
          <div className={tooltipBaseStyle}>
            <h4 className="font-bold mb-2 border-b pb-1">Detalhes do Rateio de Custos Variáveis</h4>
            <p className="text-xs text-gray-500 mb-2">
              (Total de custos variáveis mensais ÷ horas trabalhadas no mês) × tempo do serviço.
            </p>
            <div className="flex justify-between text-xs font-semibold border-b mb-1 pb-1">
                <span>Total de Custos Variáveis Mensais:</span>
                <span className="font-mono">{formatCurrency(totalCustosVariaveisMensais)}</span>
            </div>
            <ul className="space-y-1 max-h-24 overflow-y-auto">
              {custosVariaveis.map(custo => (
                <li key={custo.custoId} className="flex justify-between text-xs">
                  <span className="truncate pr-2">{custo.descricaoCusto}</span>
                  <span className="font-mono flex-shrink-0">{formatCurrency(custo.valorMensal)}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
}

const ServicoCompositionEditor: React.FC<{
    service: Servico;
    currentCompositions: ComposicaoServico[];
    allInsumos: InsumoEstoque[];
    onSave: (servicoId: string, updatedComps: ComposicaoServico[]) => void;
    onCancel: () => void;
}> = ({ service, currentCompositions, allInsumos, onSave, onCancel }) => {
    const [editedComps, setEditedComps] = useState<ComposicaoServico[]>(currentCompositions);
    const [newInsumoId, setNewInsumoId] = useState<string>('');
    const [newConsumo, setNewConsumo] = useState<string>('');

    const handleConsumptionChange = (id: string, value: string) => {
        setEditedComps(prev => prev.map(c => 
            c.composicaoId === id ? { ...c, consumoMedioPorServico: parseFloat(value) || 0 } : c
        ));
    };

    const handleRemove = (id: string) => {
        setEditedComps(prev => prev.filter(c => c.composicaoId !== id));
    };

    const handleAdd = () => {
        if (!newInsumoId || !newConsumo) return;
        const consumption = parseFloat(newConsumo);
        if(isNaN(consumption) || consumption <= 0) return;
        
        if(editedComps.some(c => c.insumoId === newInsumoId)) {
            alert("Este material já foi adicionado.");
            return;
        }

        const newComp: ComposicaoServico = {
            composicaoId: `C${Date.now()}`,
            servicoId: service.servicoId,
            insumoId: newInsumoId,
            consumoMedioPorServico: consumption,
        };
        setEditedComps(prev => [...prev, newComp]);
        setNewInsumoId('');
        setNewConsumo('');
    };

    const availableInsumos = allInsumos.filter(insumo => !editedComps.some(c => c.insumoId === insumo.insumoId));

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="space-y-2">
                {editedComps.map(comp => {
                    const insumo = allInsumos.find(i => i.insumoId === comp.insumoId);
                    return (
                        <div key={comp.composicaoId} className="flex items-center gap-2 p-2 bg-white rounded border">
                            <span className="flex-grow text-sm">{insumo?.nomeInsumo}</span>
                            <input 
                                type="number" 
                                step="0.01" 
                                value={comp.consumoMedioPorServico} 
                                onChange={e => handleConsumptionChange(comp.composicaoId, e.target.value)}
                                className="w-20 p-1 border rounded text-right"
                            />
                            <span className="text-xs text-gray-500 w-6">{insumo?.unidadeMedida}</span>
                            <button onClick={() => handleRemove(comp.composicaoId)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"><TrashIcon /></button>
                        </div>
                    );
                })}
            </div>

            <div className="border-t pt-4 mt-4">
                <h5 className="font-semibold text-gray-600 mb-2">Adicionar Material</h5>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                    <select value={newInsumoId} onChange={e => setNewInsumoId(e.target.value)} className="w-full sm:flex-grow p-2 border rounded bg-white">
                        <option value="">Selecione um material...</option>
                        {availableInsumos.map(i => <option key={i.insumoId} value={i.insumoId}>{i.nomeInsumo}</option>)}
                    </select>
                    <input 
                        type="number" 
                        placeholder="Qtd." 
                        step="0.01" 
                        value={newConsumo} 
                        onChange={e => setNewConsumo(e.target.value)}
                        className="w-full sm:w-24 p-2 border rounded"
                    />
                    <button type="button" onClick={handleAdd} className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 font-semibold">Adicionar</button>
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <button onClick={onCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 font-semibold">Cancelar</button>
                <button onClick={() => onSave(service.servicoId, editedComps)} className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 font-semibold">Salvar Alterações</button>
            </div>
        </div>
    );
};

const ServicoPricingEditor: React.FC<{
    service: Servico;
    details: ServicePriceDetails;
    onUpdateServico: (updatedServico: Servico) => void;
}> = ({ service, details, onUpdateServico }) => {
    const custoProduto = details.custoMaterial + details.custoAmortizacao;
    const [price, setPrice] = useState<number | string>(details.precoSugerido);
    const [margin, setMargin] = useState<number | string>(service.margemLucroDesejada * 100);
    const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

    useEffect(() => {
        setPrice(details.precoSugerido);
        setMargin(service.margemLucroDesejada * 100);
    }, [details.precoSugerido, service.margemLucroDesejada]);
    
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setPrice('');
            setMargin('');
            return;
        }
        const newPrice = parseFloat(value);
        setPrice(newPrice);
        if (!isNaN(newPrice) && custoProduto > 0) {
            const newMargin = ((newPrice / custoProduto) - 1) * 100;
            setMargin(newMargin);
        }
    };

    const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setPrice('');
            setMargin('');
            return;
        }
        const newMarginPercent = parseFloat(value);
        setMargin(newMarginPercent);
        if (!isNaN(newMarginPercent)) {
            const newPrice = custoProduto * (1 + newMarginPercent / 100);
            setPrice(newPrice);
        }
    };

    const handleSave = () => {
        const newMarginPercent = parseFloat(String(margin));
        if (!isNaN(newMarginPercent)) {
            setSaveState('saving');
            onUpdateServico({ ...service, margemLucroDesejada: newMarginPercent / 100 });
            setTimeout(() => setSaveState('saved'), 500);
            setTimeout(() => setSaveState('idle'), 2000);
        } else {
            alert('Valor da margem inválido.');
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border h-full flex flex-col">
            <h4 className="font-bold text-md text-gray-800 mb-2">2. Definir Preço de Venda</h4>
            <p className="text-xs text-gray-600 mb-4 flex-grow">
                Ajuste o markup ou o preço final. Um alterará o outro automaticamente.
            </p>
            <div className="space-y-3">
                <div>
                    <label htmlFor={`margin-${service.servicoId}`} className="block text-sm font-medium text-gray-700">Markup de Lucro (%)</label>
                    <input 
                        id={`margin-${service.servicoId}`}
                        type="number" 
                        step="1"
                        value={typeof margin === 'number' ? margin.toFixed(1) : ''}
                        onChange={handleMarginChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                    />
                </div>
                <div>
                    <label htmlFor={`price-${service.servicoId}`} className="block text-sm font-medium text-gray-700">Preço de Venda Final (R$)</label>
                    <input 
                        id={`price-${service.servicoId}`}
                        type="number" 
                        step="0.01"
                        value={typeof price === 'number' ? price.toFixed(2) : ''}
                        onChange={handlePriceChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                    />
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <button 
                    onClick={handleSave}
                    disabled={saveState !== 'idle'}
                    className={`bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition-colors duration-300 font-semibold disabled:bg-pink-300 disabled:cursor-not-allowed`}
                >
                    {saveState === 'idle' && 'Salvar Markup'}
                    {saveState === 'saving' && 'Salvando...'}
                    {saveState === 'saved' && 'Salvo!'}
                </button>
            </div>
        </div>
    );
};


const ServicosView: React.FC<ServicosViewProps> = ({ servicos, priceDetailsMap, composicoes, insumos, onUpdateComposicoes, ativosFixos, custosOperacionais, horasTrabalhadasMes, onHorasTrabalhadasChange, onUpdateServico }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const toggleExpand = (servicoId: string) => {
    setExpandedId(prevId => {
        const newId = prevId === servicoId ? null : servicoId;
        if(newId === null) {
            setEditingId(null); // Close editor when collapsing
        }
        return newId;
    });
  };

  const handleSaveCompositions = (servicoId: string, updatedComps: ComposicaoServico[]) => {
    onUpdateComposicoes(servicoId, updatedComps);
    setEditingId(null);
  };
  
  const handleHorasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
        onHorasTrabalhadasChange(value);
    }
  }

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <h1 className="text-3xl font-bold text-gray-800">Serviços e Precificação</h1>

       <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Configuração da Precificação</h2>
        <div className="flex items-center gap-4 flex-wrap">
            <label htmlFor="horas-trabalho" className="text-sm font-medium text-gray-700">
                Horas de Trabalho Estimadas por Mês:
            </label>
            <input 
                type="number"
                id="horas-trabalho"
                value={horasTrabalhadasMes}
                onChange={handleHorasChange}
                className="w-24 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                min="1"
            />
        </div>
        <p className="text-xs text-gray-500 mt-2 max-w-md">
            Este valor é crucial para ratear seus custos fixos e variáveis no preço de cada serviço.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {servicos.map(servico => {
            const details = priceDetailsMap.get(servico.servicoId);
            const isExpanded = expandedId === servico.servicoId;
            const serviceCompositions = composicoes.filter(c => c.servicoId === servico.servicoId);

            if (!details) return null; // Should not happen

            const custoProduto = details.custoMaterial + details.custoAmortizacao;
            const lucroBruto = details.precoSugerido - custoProduto;
            const lucroLiquidoEstimado = details.precoSugerido - details.custoTotal;
            {/* FIX: Use 'servico' which is in scope, and assign it to the 'service' property. */}
            const tooltipProps = { service: servico, composicoesDoServico: serviceCompositions, insumos, ativosFixos, custosOperacionais };

            return (
              <li key={servico.servicoId} className="p-4">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpand(servico.servicoId)}
                >
                  <div>
                    <p className="text-md font-semibold text-pink-600">{servico.nomeServico}</p>
                    <p className="text-sm text-gray-500">{servico.tempoEstimadoMinutos} min</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-gray-800">
                      {details ? details.precoSugerido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '...'}
                    </span>
                    {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  </div>
                </div>
                
                {isExpanded && (
                    <div className="mt-4 pt-4 border-t bg-gray-50 p-4 rounded-lg animate-fade-in">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            
                            {/* Coluna Esquerda: Custo e Precificação */}
                            <div className="space-y-6">
                                {/* Card Custo do Produto */}
                                <div className="bg-white p-4 rounded-lg shadow-md border">
                                    <h4 className="font-bold text-md text-gray-800 mb-2">1. Custo do Produto</h4>
                                    <div className="text-sm space-y-2 text-gray-600">
                                        <div className="relative flex justify-between items-center" onMouseEnter={() => setActiveTooltip('material')} onMouseLeave={() => setActiveTooltip(null)}>
                                            <span className="flex items-center cursor-help">Custo de Material <InfoIcon /></span>
                                            <span className="font-mono">{formatCurrency(details.custoMaterial)}</span>
                                            {activeTooltip === 'material' && <TooltipContent type='material' {...tooltipProps} />}
                                        </div>
                                        <div className="relative flex justify-between items-center" onMouseEnter={() => setActiveTooltip('amortizacao')} onMouseLeave={() => setActiveTooltip(null)}>
                                            <span className="flex items-center cursor-help">Amortização de Equipamentos <InfoIcon /></span>
                                            <span className="font-mono">{formatCurrency(details.custoAmortizacao)}</span>
                                            {activeTooltip === 'amortizacao' && <TooltipContent type='amortizacao' {...tooltipProps} />}
                                        </div>
                                        <div className="flex justify-between items-center border-t pt-2 mt-2">
                                            <span className="font-semibold text-gray-800">Custo Total do Produto</span>
                                            <span className="font-bold font-mono text-red-600">{formatCurrency(custoProduto)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Card Precificação */}
                                <ServicoPricingEditor 
                                    service={servico}
                                    details={details}
                                    onUpdateServico={onUpdateServico}
                                />
                            </div>

                            {/* Coluna Direita: Análise e Materiais */}
                            <div className="space-y-6">
                                {/* Card Análise do Preço */}
                                <div className="bg-white p-4 rounded-lg shadow-md border">
                                    <h4 className="font-bold text-md text-gray-800 mb-2">3. Análise do Preço</h4>
                                    <div className="text-sm space-y-2 text-gray-600">
                                        <div className="flex justify-between items-center"><span >Preço de Venda Final</span><span className="font-mono">{formatCurrency(details.precoSugerido)}</span></div>
                                        <div className="flex justify-between items-center"><span >(-) Custo Total do Produto</span><span className="font-mono">-{formatCurrency(custoProduto)}</span></div>
                                        <div className="flex justify-between items-center border-t pt-2 mt-2">
                                            <span className="font-semibold text-gray-800">(=) Lucro Bruto por Serviço</span>
                                            <span className={`font-bold font-mono ${lucroBruto >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatCurrency(lucroBruto)}</span>
                                        </div>
                                        <div className="relative flex justify-between items-center" onMouseEnter={() => setActiveTooltip('rateioFixo')} onMouseLeave={() => setActiveTooltip(null)}>
                                            <span className="flex items-center cursor-help">(-) Rateio Custo Fixo <InfoIcon /></span><span className="font-mono">-{formatCurrency(details.rateioCustoFixo)}</span>
                                            {activeTooltip === 'rateioFixo' && <TooltipContent type='rateioFixo' {...tooltipProps} />}
                                        </div>
                                        <div className="relative flex justify-between items-center" onMouseEnter={() => setActiveTooltip('rateioVariavel')} onMouseLeave={() => setActiveTooltip(null)}>
                                            <span className="flex items-center cursor-help">(-) Rateio Custo Variável <InfoIcon /></span><span className="font-mono">-{formatCurrency(details.rateioCustoVariavel)}</span>
                                            {activeTooltip === 'rateioVariavel' && <TooltipContent type='rateioVariavel' {...tooltipProps} />}
                                        </div>
                                        <div className="flex justify-between items-center border-t pt-2 mt-2 bg-green-50 p-2 rounded">
                                            <span className="font-semibold text-gray-800">(=) Lucro Líquido Estimado</span>
                                            <span className={`font-bold font-mono text-lg ${lucroLiquidoEstimado >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(lucroLiquidoEstimado)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Card Materiais */}
                                <div className="bg-white p-4 rounded-lg shadow-md border">
                                    {editingId === servico.servicoId ? (
                                        <ServicoCompositionEditor 
                                            service={servico}
                                            currentCompositions={serviceCompositions}
                                            allInsumos={insumos}
                                            onSave={handleSaveCompositions}
                                            onCancel={() => setEditingId(null)}
                                        />
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-bold text-md text-gray-800">4. Materiais Utilizados</h4>
                                                <button 
                                                    onClick={() => setEditingId(servico.servicoId)}
                                                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-semibold"
                                                >
                                                    <PencilIcon />
                                                    Editar
                                                </button>
                                            </div>
                                            <ul className="space-y-1 text-sm text-gray-600 max-h-40 overflow-y-auto">
                                                {serviceCompositions.length > 0 ? serviceCompositions.map(comp => {
                                                    const insumo = insumos.find(i => i.insumoId === comp.insumoId);
                                                    return (
                                                        <li key={comp.composicaoId} className="flex justify-between py-1 border-b border-gray-100">
                                                            <span>{insumo?.nomeInsumo || 'Insumo não encontrado'}</span>
                                                            <span className="font-mono">{comp.consumoMedioPorServico} {insumo?.unidadeMedida}</span>
                                                        </li>
                                                    );
                                                }) : <p className="text-gray-400 text-sm">Nenhum material cadastrado.</p>}
                                            </ul>
                                        </>
                                    )}
                                </div>

                            </div>

                        </div>
                    </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ServicosView;