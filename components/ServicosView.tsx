import React, { useState } from 'react';
import { Servico, ServicePriceDetails, ComposicaoServico, InsumoEstoque } from '../types';
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashIcon } from './icons/Icons';

interface ServicosViewProps {
  servicos: Servico[];
  priceDetailsMap: Map<string, ServicePriceDetails>;
  composicoes: ComposicaoServico[];
  insumos: InsumoEstoque[];
  onUpdateComposicoes: (servicoId: string, updatedComps: ComposicaoServico[]) => void;
}

const ServicoDetail: React.FC<{ service: Servico, details: ServicePriceDetails }> = ({ service, details }) => {
  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="bg-gray-50 p-4 mt-2 rounded-lg border animate-fade-in">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-2 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Custo Total</p>
                <p className="text-lg font-bold text-red-600">{formatCurrency(details.custoTotal)}</p>
            </div>
            <div className="p-2 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Preço Piso</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(details.precoSugerido)}</p>
            </div>
            <div className="p-2 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Margem (R$)</p>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(details.margemContribuicaoRS)}</p>
            </div>
            <div className="p-2 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Margem/Hora</p>
                <p className="text-lg font-bold text-purple-600">{formatCurrency(details.margemContribuicaoHora)}</p>
            </div>
        </div>
        <div className="mt-4 text-sm text-gray-600 space-y-1">
            <p><strong>Detalhes do Custo:</strong></p>
            <div className="flex justify-between border-b pb-1"><span>Custo Material:</span> <span className="font-mono">{formatCurrency(details.custoMaterial)}</span></div>
            <div className="flex justify-between border-b pb-1"><span>Amortização Ativos:</span> <span className="font-mono">{formatCurrency(details.custoAmortizacao)}</span></div>
            <div className="flex justify-between"><span>Rateio Custo Fixo:</span> <span className="font-mono">{formatCurrency(details.rateioCustoOperacional)}</span></div>
        </div>
    </div>
  );
};

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


const ServicosView: React.FC<ServicosViewProps> = ({ servicos, priceDetailsMap, composicoes, insumos, onUpdateComposicoes }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <h1 className="text-3xl font-bold text-gray-800">Serviços e Precificação</h1>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {servicos.map(servico => {
            const details = priceDetailsMap.get(servico.servicoId);
            const isExpanded = expandedId === servico.servicoId;
            const serviceCompositions = composicoes.filter(c => c.servicoId === servico.servicoId);
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
                {isExpanded && details && <ServicoDetail service={servico} details={details} />}
                {isExpanded && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
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
                                    <h4 className="font-semibold text-md text-gray-700">Materiais Necessários</h4>
                                    <button 
                                        onClick={() => setEditingId(servico.servicoId)}
                                        className="flex items-center gap-2 text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        <PencilIcon />
                                        Editar
                                    </button>
                                </div>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    {serviceCompositions.length > 0 ? serviceCompositions.map(comp => {
                                        const insumo = insumos.find(i => i.insumoId === comp.insumoId);
                                        return (
                                            <li key={comp.composicaoId} className="flex justify-between py-1 border-b border-gray-200">
                                                <span>{insumo?.nomeInsumo || 'Insumo não encontrado'}</span>
                                                <span className="font-mono">{comp.consumoMedioPorServico} {insumo?.unidadeMedida}</span>
                                            </li>
                                        );
                                    }) : <p className="text-gray-400">Nenhum material cadastrado.</p>}
                                </ul>
                            </>
                        )}
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