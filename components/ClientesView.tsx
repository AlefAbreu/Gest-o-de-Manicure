import React, { useState } from 'react';
import { Cliente } from '../types';
import { PencilIcon, TrashIcon, CheckIcon, XIcon, UserGroupIcon } from './icons/Icons';

interface ClientesViewProps {
  clientes: Cliente[];
  onAddCliente: (newCliente: Omit<Cliente, 'clienteId'>) => void;
  onUpdateCliente: (updatedCliente: Cliente) => void;
  onDeleteCliente: (clienteId: string) => void;
}

const ClientesView: React.FC<ClientesViewProps> = ({ clientes, onAddCliente, onUpdateCliente, onDeleteCliente }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nomeCliente: '',
    contatoTelefone: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Omit<Cliente, 'clienteId'>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStartEditing = (cliente: Cliente) => {
    setEditingId(cliente.clienteId);
    setEditFormData({
      nomeCliente: cliente.nomeCliente,
      contatoTelefone: cliente.contatoTelefone,
    });
  };

  const handleCancelEditing = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSaveEditing = (clienteToUpdate: Cliente) => {
    const updatedCliente: Cliente = {
      ...clienteToUpdate,
      nomeCliente: editFormData.nomeCliente || clienteToUpdate.nomeCliente,
      contatoTelefone: editFormData.contatoTelefone || clienteToUpdate.contatoTelefone,
    };
    onUpdateCliente(updatedCliente);
    handleCancelEditing();
  };

  const handleDelete = (clienteId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      onDeleteCliente(clienteId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomeCliente) {
        alert("O nome do cliente é obrigatório.");
        return;
    }
    onAddCliente(formData);
    setShowForm(false);
    setFormData({ nomeCliente: '', contatoTelefone: '' });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition-colors duration-300 font-semibold">
          {showForm ? 'Cancelar' : 'Novo Cliente'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-fade-in-down">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Adicionar Novo Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="nomeCliente" value={formData.nomeCliente} onChange={handleChange} placeholder="Nome Completo" required className="p-2 border rounded"/>
              <input name="contatoTelefone" value={formData.contatoTelefone} onChange={handleChange} placeholder="Telefone (Opcional)" className="p-2 border rounded"/>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition-colors duration-300 font-semibold">Salvar Cliente</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {clientes.map(cliente => {
            const isEditing = editingId === cliente.clienteId;
            if (isEditing) {
              return (
                <li key={cliente.clienteId} className="p-4 bg-pink-50">
                  <div className="flex items-center gap-4">
                    <div className="flex-grow">
                      <input type="text" name="nomeCliente" value={editFormData.nomeCliente} onChange={handleEditChange} className="w-full p-1 border rounded text-sm"/>
                    </div>
                    <div className="flex-grow">
                      <input type="text" name="contatoTelefone" value={editFormData.contatoTelefone} onChange={handleEditChange} className="w-full p-1 border rounded text-sm"/>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleSaveEditing(cliente)} className="text-green-600 hover:text-green-800 p-1"><CheckIcon /></button>
                      <button onClick={handleCancelEditing} className="text-red-600 hover:text-red-800 p-1"><XIcon /></button>
                    </div>
                  </div>
                </li>
              );
            }
            return (
              <li key={cliente.clienteId} className="p-4 flex justify-between items-center group hover:bg-gray-50">
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-gray-100 rounded-full"><UserGroupIcon /></div>
                   <div>
                      <p className="font-semibold text-gray-800">{cliente.nomeCliente}</p>
                      <p className="text-sm text-gray-500">{cliente.contatoTelefone}</p>
                   </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleStartEditing(cliente)} className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"><PencilIcon /></button>
                  <button onClick={() => handleDelete(cliente.clienteId)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"><TrashIcon /></button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ClientesView;
