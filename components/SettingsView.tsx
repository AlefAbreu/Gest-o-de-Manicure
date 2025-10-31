import React from 'react';
import { ExclamationTriangleIcon } from './icons/Icons';

interface SettingsViewProps {
  onClearVendas: () => void;
  onClearClientes: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onClearVendas, onClearClientes }) => {
  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
      
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg" role="alert">
        <div className="flex">
          <div className="py-1">
            <ExclamationTriangleIcon />
          </div>
          <div className="ml-3">
            <p className="font-bold text-red-800">Área de Risco</p>
            <p className="text-sm text-red-700">As ações abaixo são permanentes e não podem ser desfeitas. Prossiga com muito cuidado.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 divide-y divide-gray-200">
          {/* Clear Sales */}
          <div className="py-4">
              <h2 className="text-lg font-semibold text-gray-800">Zerar Histórico de Vendas</h2>
              <p className="text-sm text-gray-600 mt-1 max-w-prose">
                  Esta ação irá apagar permanentemente todo o histórico de vendas.
                  <strong>O estoque dos insumos que foram consumidos NÃO será restaurado.</strong> Esta ação é irreversível.
              </p>
              <button 
                onClick={onClearVendas} 
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition-colors duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                  Zerar Vendas
              </button>
          </div>

          {/* Clear Clients */}
           <div className="py-4">
              <h2 className="text-lg font-semibold text-gray-800">Apagar Todos os Clientes</h2>
              <p className="text-sm text-gray-600 mt-1 max-w-prose">
                  Esta ação irá apagar permanentemente todos os clientes cadastrados.
                  As vendas existentes continuarão no sistema, mas o nome do cliente associado será perdido.
                  Esta ação é irreversível.
              </p>
              <button 
                onClick={onClearClientes} 
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition-colors duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Apagar Clientes
              </button>
          </div>
      </div>
    </div>
  );
};

export default SettingsView;
