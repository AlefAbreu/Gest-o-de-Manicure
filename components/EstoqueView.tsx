import React, { useState } from 'react';
import { InsumoEstoque, UnidadeMedida } from '../types';
import { PencilIcon, CheckIcon, XIcon, TrashIcon } from './icons/Icons';

interface EstoqueViewProps {
  insumos: InsumoEstoque[];
  onAddInsumo: (newInsumo: Omit<InsumoEstoque, 'insumoId'>) => void;
  onUpdateInsumo: (updatedInsumo: InsumoEstoque) => void;
  onDeleteInsumo: (insumoId: string) => void;
}

const EstoqueView: React.FC<EstoqueViewProps> = ({ insumos, onAddInsumo, onUpdateInsumo, onDeleteInsumo }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nomeInsumo: '',
    marca: '',
    unidadeMedida: UnidadeMedida.UN,
    tamanhoEmbalagem: '',
    custoEmbalagem: '',
    dataCompra: new Date().toISOString().split('T')[0],
    dataValidade: '',
    fornecedor: '',
    estoqueAtualEmbalagens: '',
    estoqueMinimoAlerta: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<InsumoEstoque>>({});

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to the start of the day
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setEditFormData(prev => ({...prev, [name]: value }));
  }

  const handleStartEditing = (insumo: InsumoEstoque) => {
    setEditingId(insumo.insumoId);
    setEditFormData({
        estoqueAtualEmbalagens: insumo.estoqueAtualEmbalagens,
        estoqueMinimoAlerta: insumo.estoqueMinimoAlerta,
        dataValidade: insumo.dataValidade.split('T')[0],
    });
  }

  const handleCancelEditing = () => {
    setEditingId(null);
    setEditFormData({});
  }

  const handleSaveEditing = (insumoToUpdate: InsumoEstoque) => {
    const updatedInsumo: InsumoEstoque = {
        ...insumoToUpdate,
        estoqueAtualEmbalagens: parseFloat(String(editFormData.estoqueAtualEmbalagens)) || insumoToUpdate.estoqueAtualEmbalagens,
        estoqueMinimoAlerta: parseFloat(String(editFormData.estoqueMinimoAlerta)) || insumoToUpdate.estoqueMinimoAlerta,
        dataValidade: editFormData.dataValidade ? new Date(editFormData.dataValidade).toISOString() : insumoToUpdate.dataValidade,
    };
    onUpdateInsumo(updatedInsumo);
    handleCancelEditing();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInsumo = {
        ...formData,
        tamanhoEmbalagem: parseFloat(formData.tamanhoEmbalagem),
        custoEmbalagem: parseFloat(formData.custoEmbalagem),
        estoqueAtualEmbalagens: parseFloat(formData.estoqueAtualEmbalagens),
        estoqueMinimoAlerta: parseFloat(formData.estoqueMinimoAlerta),
    };
    onAddInsumo(newInsumo);
    setShowForm(false);
    // Reset form
    setFormData({
        nomeInsumo: '',
        marca: '',
        unidadeMedida: UnidadeMedida.UN,
        tamanhoEmbalagem: '',
        custoEmbalagem: '',
        dataCompra: new Date().toISOString().split('T')[0],
        dataValidade: '',
        fornecedor: '',
        estoqueAtualEmbalagens: '',
        estoqueMinimoAlerta: '',
    });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Controle de Estoque</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition-colors duration-300 font-semibold"
            >
              {showForm ? 'Cancelar' : 'Novo Produto'}
            </button>
        </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-fade-in-down">
          <form onSubmit={handleSubmit} className="space-y-4">
             <h2 className="text-xl font-semibold text-gray-700">Cadastrar Novo Produto</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input name="nomeInsumo" value={formData.nomeInsumo} onChange={handleChange} placeholder="Nome do Produto" required className="p-2 border rounded"/>
                <input name="marca" value={formData.marca} onChange={handleChange} placeholder="Marca" className="p-2 border rounded"/>
                <select name="unidadeMedida" value={formData.unidadeMedida} onChange={handleChange} className="p-2 border rounded">
                    {Object.values(UnidadeMedida).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <input name="tamanhoEmbalagem" type="number" value={formData.tamanhoEmbalagem} onChange={handleChange} placeholder="Tamanho da Embalagem" required className="p-2 border rounded"/>
                <input name="custoEmbalagem" type="number" step="0.01" value={formData.custoEmbalagem} onChange={handleChange} placeholder="Custo da Embalagem" required className="p-2 border rounded"/>
                <input name="dataValidade" type="date" value={formData.dataValidade} onChange={handleChange} required className="p-2 border rounded"/>
                <input name="fornecedor" value={formData.fornecedor} onChange={handleChange} placeholder="Fornecedor" className="p-2 border rounded"/>
                <input name="estoqueAtualEmbalagens" type="number" value={formData.estoqueAtualEmbalagens} onChange={handleChange} placeholder="Estoque Atual (Emb.)" required className="p-2 border rounded"/>
                <input name="estoqueMinimoAlerta" type="number" value={formData.estoqueMinimoAlerta} onChange={handleChange} placeholder="Alerta Mínimo (Emb.)" required className="p-2 border rounded"/>
             </div>
             <div className="flex justify-end">
                <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition-colors duration-300 font-semibold">Salvar Produto</button>
            </div>
          </form>
        </div>
      )}


      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">Produto</th>
              <th scope="col" className="px-6 py-3">Estoque Atual</th>
              <th scope="col" className="px-6 py-3">Alerta Mínimo</th>
              <th scope="col" className="px-6 py-3">Validade</th>
              <th scope="col" className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {insumos.map(insumo => {
              const isEditing = editingId === insumo.insumoId;
              if (isEditing) {
                return (
                    <tr key={insumo.insumoId} className="bg-pink-50 border-b">
                        <td className="px-6 py-4 font-semibold">{insumo.nomeInsumo}</td>
                        <td className="px-6 py-4"><input type="number" name="estoqueAtualEmbalagens" value={editFormData.estoqueAtualEmbalagens} onChange={handleEditChange} className="w-24 p-1 border rounded" /></td>
                        <td className="px-6 py-4"><input type="number" name="estoqueMinimoAlerta" value={editFormData.estoqueMinimoAlerta} onChange={handleEditChange} className="w-24 p-1 border rounded" /></td>
                        <td className="px-6 py-4"><input type="date" name="dataValidade" value={editFormData.dataValidade as string} onChange={handleEditChange} className="p-1 border rounded" /></td>
                        <td className="px-6 py-4 flex items-center gap-2">
                            <button onClick={() => handleSaveEditing(insumo)} className="text-green-600 hover:text-green-800 p-1"><CheckIcon /></button>
                            <button onClick={handleCancelEditing} className="text-red-600 hover:text-red-800 p-1"><XIcon /></button>
                        </td>
                    </tr>
                );
              }

              const dataValidade = new Date(insumo.dataValidade);
              const isExpired = dataValidade < today;
              const isExpiring = !isExpired && dataValidade <= thirtyDaysFromNow;
              const isLowStock = insumo.estoqueAtualEmbalagens <= insumo.estoqueMinimoAlerta;
              
              let rowClass = 'bg-white';
              let alertText = null;

              if (isExpired) {
                  rowClass = 'bg-red-200 text-red-900 font-bold';
                  alertText = '(VENCIDO!)';
              } else if (isLowStock) {
                  rowClass = 'bg-red-100 text-red-800';
                  alertText = '(Estoque Baixo)';
              } else if (isExpiring) {
                  rowClass = 'bg-yellow-100 text-yellow-800';
                  alertText = '(Vencendo)';
              }

              return (
                <tr key={insumo.insumoId} className={`${rowClass} border-b hover:bg-gray-50`}>
                  <td className="px-6 py-4 font-semibold">
                    {insumo.nomeInsumo}
                    <span className="block text-xs font-normal text-gray-500">{insumo.marca}</span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {insumo.estoqueAtualEmbalagens.toFixed(2)} {insumo.unidadeMedida === 'un' ? 'unid.' : 'emb.'}
                  </td>
                  <td className="px-6 py-4">
                    {insumo.estoqueMinimoAlerta.toFixed(2)} {insumo.unidadeMedida === 'un' ? 'unid.' : 'emb.'}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(insumo.dataValidade).toLocaleDateString('pt-BR')}
                    {alertText && <span className="ml-2 text-xs font-semibold">{alertText}</span>}
                  </td>

                  <td className="px-6 py-4 flex items-center gap-1">
                    <button onClick={() => handleStartEditing(insumo)} className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100">
                        <PencilIcon />
                    </button>
                    <button onClick={() => onDeleteInsumo(insumo.insumoId)} className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100">
                        <TrashIcon />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EstoqueView;