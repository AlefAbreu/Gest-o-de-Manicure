// Fix: Removed circular import from './types' and defined missing enums.
export enum View {
  Caixa = 'Caixa',
  Estoque = 'Estoque',
  Servicos = 'Serviços',
  Dashboard = 'Dashboard',
  Clientes = 'Clientes',
  Agenda = 'Agenda',
  Custos = 'Custos',
}

export enum UnidadeMedida {
  UN = 'un',
  G = 'g',
  ML = 'ml',
}

export enum FormaPagamento {
  PIX = 'PIX',
  Credito = 'Crédito',
  Debito = 'Débito',
  Dinheiro = 'Dinheiro',
}

export enum TipoCusto {
  Fixo = 'Fixo',
  Variavel = 'Variável',
}


export interface InsumoEstoque {
  insumoId: string;
  nomeInsumo: string;
  marca: string;
  unidadeMedida: UnidadeMedida;
  tamanhoEmbalagem: number;
  custoEmbalagem: number;
  dataCompra: string;
  dataValidade: string;
  fornecedor: string;
  estoqueAtualEmbalagens: number;
  estoqueMinimoAlerta: number;
}

export interface Servico {
  servicoId: string;
  nomeServico: string;
  tempoEstimadoMinutos: number;
  margemLucroDesejada: number;
}

export interface ComposicaoServico {
  composicaoId: string;
  servicoId: string;
  insumoId: string;
  consumoMedioPorServico: number;
}

export interface VendaCaixa {
  vendaId: string;
  dataVenda: string;
  clienteId: string;
  servicoId: string;
  quantidadeServicos: number;
  valorCobrado: number;
  formaPagamento: FormaPagamento;
}

export interface Cliente {
  clienteId: string;
  nomeCliente: string;
  contatoTelefone: string;
}

export interface CustoOperacional {
  custoId: string;
  descricaoCusto: string;
  tipoCusto: TipoCusto;
  valorMensal: number;
  dataRegistro: string;
}

export interface AtivoFixo {
  ativoId: string;
  nomeAtivo: string;
  custoAquisicao: number;
  vidaUtilHoras: number;
  servicosRelacionados: string[]; // Array of servicoId
}

export interface ServicePriceDetails {
  custoMaterial: number;
  custoAmortizacao: number;
  rateioCustoOperacional: number;
  custoTotal: number;
  precoSugerido: number;
  margemContribuicaoRS: number;
  margemContribuicaoPercent: number;
  margemContribuicaoHora: number;
}