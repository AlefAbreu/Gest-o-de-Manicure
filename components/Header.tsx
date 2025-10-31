import React from 'react';
import { View } from '../types';
import { ChartBarIcon, CurrencyDollarIcon, CubeIcon, SparklesIcon, UserGroupIcon, CalendarIcon, CashIcon, CogIcon } from './icons/Icons';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { view: View.Dashboard, label: 'Dashboard', icon: <ChartBarIcon /> },
    { view: View.Caixa, label: 'Caixa', icon: <CurrencyDollarIcon /> },
    { view: View.Estoque, label: 'Estoque', icon: <CubeIcon /> },
    { view: View.Servicos, label: 'Serviços', icon: <SparklesIcon /> },
    { view: View.Clientes, label: 'Clientes', icon: <UserGroupIcon /> },
    { view: View.Agenda, label: 'Agenda', icon: <CalendarIcon /> },
    { view: View.Custos, label: 'Custos', icon: <CashIcon /> },
    { view: View.Settings, label: 'Configurações', icon: <CogIcon /> },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="font-bold text-xl text-pink-600">Pro Gestor</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentView === item.view
                      ? 'bg-pink-600 text-white'
                      : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            {/* Mobile menu button could be added here */}
          </div>
        </div>
      </div>
      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-t border-t border-gray-200 flex justify-around overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex flex-col items-center justify-center flex-shrink-0 w-1/4 pt-2 pb-1 text-xs font-medium transition-colors duration-200 ${
                currentView === item.view
                  ? 'text-pink-600'
                  : 'text-gray-500 hover:text-pink-600'
              }`}
            >
              <div className="mb-1">{item.icon}</div>
              {item.label}
            </button>
          ))}
        </nav>
    </header>
  );
};

export default Header;