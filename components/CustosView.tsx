import React, { useState } from 'react';
import { CustoOperacional, TipoCusto } from '../types';
import { PencilIcon, TrashIcon, CheckIcon, XIcon } from './icons/Icons';

interface CustosViewProps {
  custos: CustoOperacional[];
  onAddCusto: (newCusto: Omit<CustoOperacional, 'custoId' | 'dataRegistro'>) => void;
  onEditCusto: (updatedCusto: CustoOperacional) => void;
  onDeleteCusto: (custoId: string) => void;
}

const CustosView: React.FC<CustosViewProps> = ({ custos, onAddCusto, onEditCusto, onDeleteCusto }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    descricaoCusto: '',
    tipoCusto: TipoCusto.Fixo,
    valorMensal: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<CustoOperacional>>({});

  const custosFixos = custos.filter(c => c.tipoCusto === TipoCusto.Fixo);
  const custosVariaveis = custos.filter(c => c.tipoCusto === TipoCusto.Variavel);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStartEditing = (custo: CustoOperacional) => {
    setEditingId(custo.custoId);
    setEditFormData({
      descricaoCusto: custo.descricaoCusto,
      tipoCusto: custo.tipoCusto,
      valorMensal: custo.valorMensal,
    });
  };

  const handleCancelEditing = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSaveEditing = (custoToUpdate: CustoOperacional) => {
    const updatedCusto: CustoOperacional = {
      ...custoToUpdate,
      descricaoCusto: editFormData.descricaoCusto !== undefined ? editFormData.descricaoCusto : custoToUpdate.descricaoCusto,
      tipoCusto: editFormData.tipoCusto !== undefined ? editFormData.tipoCusto : custoToUpdate.tipoCusto,
      valorMensal: !isNaN(parseFloat(String(editFormData.valorMensal))) 
                     ? parseFloat(String(editFormData.valorMensal)) 
                     : custoToUpdate.valorMensal,
    };
    onEditCusto(updatedCusto);
    handleCancelEditing();
  };

  const handleDelete = (custoId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este custo?')) {
        onDeleteCusto(custoId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricaoCusto || !formData.valorMensal) {
        alert("Preencha todos os campos.");
        return;
    }
    onAddCusto({
        ...formData,
        valorMensal: parseFloat(formData.valorMensal)
    });
    setShowForm(false);
    setFormData({ descricaoCusto: '', tipoCusto: TipoCusto.Fixo, valorMensal: '' });
  };

  const renderCostTable = (title: string, data: CustoOperacional[]) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-700 p-4 bg-gray-50 border-b">{title}</h3>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3">Descrição</th>
            <th scope="col" className="px-6 py-3">Valor Mensal</th>
            <th scope="col" className="px-6 py-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map(custo => {
            const isEditing = editingId === custo.custoId;
            if (isEditing) {
              return (
                <tr key={custo.custoId} className="bg-pink-50 border-b">
                    <td className="px-6 py-4"><input type="text" name="descricaoCusto" value={editFormData.descricaoCusto || ''} onChange={handleEditChange} className="w-full p-1 border rounded" /></td>
                    <td className="px-6 py-4"><input type="number" name="valorMensal" value={editFormData.valorMensal || ''} onChange={handleEditChange} className="w-24 p-1 border rounded" /></td>
                    <td className="px-6 py-4 flex items-center gap-2">
                        <button onClick={() => handleSaveEditing(custo)} className="text-green-600 hover:text-green-800 p-1"><CheckIcon /></button>
                        <button onClick={handleCancelEditing} className="text-red-600 hover:text-red-800 p-1"><XIcon /></button>
                    </td>
                </tr>
              )
            }
            return (
              <tr key={custo.custoId} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{custo.descricaoCusto}</td>
                <td className="px-6 py-4">{custo.valorMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="px-6 py-4 flex items-center gap-2">
                    <button onClick={() => handleStartEditing(custo)} className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"><PencilIcon /></button>
                    <button onClick={() => handleDelete(custo.custoId)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"><TrashIcon /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Custos Operacionais</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition-colors duration-300 font-semibold">
          {showForm ? 'Cancelar' : 'Novo Custo'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-fade-in-down">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Adicionar Novo Custo</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="descricaoCusto" value={formData.descricaoCusto} onChange={handleChange} placeholder="Descrição (Ex: Aluguel)" required className="p-2 border rounded md:col-span-2"/>
              <select name="tipoCusto" value={formData.tipoCusto} onChange={handleChange} className="p-2 border rounded">
                {Object.values(TipoCusto).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input name="valorMensal" type="number" step="0.01" value={formData.valorMensal} onChange={handleChange} placeholder="Valor Mensal (R$)" required className="p-2 border rounded"/>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition-colors duration-300 font-semibold">Salvar Custo</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {renderCostTable('Custos Fixos', custosFixos)}
        {renderCostTable('Custos Variáveis (Estimativa Mensal)', custosVariaveis)}
      </div>
    </div>
  );
};

export default CustosView;