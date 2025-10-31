
import { InsumoEstoque, Servico, ComposicaoServico, VendaCaixa, Cliente, CustoOperacional, AtivoFixo, UnidadeMedida, FormaPagamento, TipoCusto } from './types';

export const INITIAL_CLIENTES: Cliente[] = [
  { clienteId: 'CLI001', nomeCliente: 'Ana Silva', contatoTelefone: '11987654321' },
  { clienteId: 'CLI002', nomeCliente: 'Beatriz Costa', contatoTelefone: '21912345678' },
  { clienteId: 'CLI003', nomeCliente: 'Carla Dias', contatoTelefone: '31988887777' },
];

export const INITIAL_ATIVOS_FIXOS: AtivoFixo[] = [
  { ativoId: 'ATV01', nomeAtivo: 'Cabine UV/LED', custoAquisicao: 150.00, vidaUtilHoras: 3000, servicosRelacionados: ['SERV002', 'SERV003'] },
  { ativoId: 'ATV02', nomeAtivo: 'Lixadeira Elétrica', custoAquisicao: 120.00, vidaUtilHoras: 1000, servicosRelacionados: ['SERV002', 'SERV003'] },
  { ativoId: 'ATV03', nomeAtivo: 'Autoclave', custoAquisicao: 1500.00, vidaUtilHoras: 5000, servicosRelacionados: ['SERV001', 'SERV002', 'SERV003'] },
];

export const INITIAL_CUSTOS_OPERACIONAIS: CustoOperacional[] = [
  { custoId: 'COP01', descricaoCusto: 'Aluguel do Espaço', tipoCusto: TipoCusto.Fixo, valorMensal: 800.00, dataRegistro: '2023-01-01' },
  { custoId: 'COP02', descricaoCusto: 'Plano de Internet', tipoCusto: TipoCusto.Fixo, valorMensal: 99.90, dataRegistro: '2023-01-01' },
  { custoId: 'COP03', descricaoCusto: 'Contribuição MEI (DAS)', tipoCusto: TipoCusto.Fixo, valorMensal: 80.90, dataRegistro: '2023-01-01' },
  { custoId: 'COP04', descricaoCusto: 'Energia Elétrica', tipoCusto: TipoCusto.Variavel, valorMensal: 150.00, dataRegistro: '2023-01-01' },
];

export const INITIAL_INSUMOS: InsumoEstoque[] = [
  { insumoId: 'DESC01', nomeInsumo: 'Kit Manicure Descartável', marca: 'Clean Express', unidadeMedida: UnidadeMedida.UN, tamanhoEmbalagem: 1, custoEmbalagem: 1.93, dataCompra: '2023-10-01', dataValidade: '2025-10-01', fornecedor: 'Distribuidor Local', estoqueAtualEmbalagens: 50, estoqueMinimoAlerta: 10 },
  { insumoId: 'GELV01', nomeInsumo: 'Gel Construtor Classic Pink', marca: 'Vòlia', unidadeMedida: UnidadeMedida.G, tamanhoEmbalagem: 24, custoEmbalagem: 67.00, dataCompra: '2023-10-01', dataValidade: '2024-10-01', fornecedor: 'Cosméticos Web', estoqueAtualEmbalagens: 2, estoqueMinimoAlerta: 0.5 },
  { insumoId: 'FIBW01', nomeInsumo: 'Fibra de Vidro em Rolo', marca: 'W&K', unidadeMedida: UnidadeMedida.UN, tamanhoEmbalagem: 50, custoEmbalagem: 6.00, dataCompra: '2023-09-15', dataValidade: '2026-09-15', fornecedor: 'MissNails', estoqueAtualEmbalagens: 3, estoqueMinimoAlerta: 1 },
  { insumoId: 'PREP01', nomeInsumo: 'Desidratador/Primer', marca: 'Genérica', unidadeMedida: UnidadeMedida.ML, tamanhoEmbalagem: 15, custoEmbalagem: 20.00, dataCompra: '2023-09-01', dataValidade: '2025-03-01', fornecedor: 'Distribuidor Local', estoqueAtualEmbalagens: 1, estoqueMinimoAlerta: 0.2 },
  { insumoId: 'TOPC01', nomeInsumo: 'Top Coat Selante', marca: 'Genérica', unidadeMedida: UnidadeMedida.ML, tamanhoEmbalagem: 15, custoEmbalagem: 30.00, dataCompra: '2023-09-01', dataValidade: '2025-09-01', fornecedor: 'Cosméticos Web', estoqueAtualEmbalagens: 1.5, estoqueMinimoAlerta: 0.5 },
];

export const INITIAL_SERVICOS: Servico[] = [
  { servicoId: 'SERV001', nomeServico: 'Manicure Simples', tempoEstimadoMinutos: 60, margemLucroDesejada: 0.90 },
  { servicoId: 'SERV002', nomeServico: 'Esmaltação em Gel', tempoEstimadoMinutos: 90, margemLucroDesejada: 0.867 },
  { servicoId: 'SERV003', nomeServico: 'Unha de Fibra de Vidro', tempoEstimadoMinutos: 180, margemLucroDesejada: 0.875 },
];

export const INITIAL_COMPOSICOES: ComposicaoServico[] = [
  { composicaoId: 'C001', servicoId: 'SERV001', insumoId: 'DESC01', consumoMedioPorServico: 1 },
  { composicaoId: 'C002', servicoId: 'SERV002', insumoId: 'PREP01', consumoMedioPorServico: 0.25 }, // 15ml / 60 app
  { composicaoId: 'C003', servicoId: 'SERV002', insumoId: 'GELV01', consumoMedioPorServico: 0.6 },   // 24g / 40 app
  { composicaoId: 'C004', servicoId: 'SERV002', insumoId: 'TOPC01', consumoMedioPorServico: 0.3 },   // 15ml / 50 app
  { composicaoId: 'C005', servicoId: 'SERV003', insumoId: 'PREP01', consumoMedioPorServico: 0.25 },
  { composicaoId: 'C006', servicoId: 'SERV003', insumoId: 'GELV01', consumoMedioPorServico: 1.2 },  // 24g / 20 app
  { composicaoId: 'C007', servicoId: 'SERV003', insumoId: 'FIBW01', consumoMedioPorServico: 1 },    // 50 unhas / 50 app
  { composicaoId: 'C008', servicoId: 'SERV003', insumoId: 'TOPC01', consumoMedioPorServico: 0.3 },
];

export const INITIAL_VENDAS: VendaCaixa[] = [
  { vendaId: 'V001', dataVenda: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), clienteId: 'CLI001', servicoId: 'SERV003', quantidadeServicos: 1, valorCobrado: 120.00, formaPagamento: FormaPagamento.Credito },
  { vendaId: 'V002', dataVenda: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), clienteId: 'CLI002', servicoId: 'SERV002', quantidadeServicos: 1, valorCobrado: 60.00, formaPagamento: FormaPagamento.PIX },
  { vendaId: 'V003', dataVenda: new Date().toISOString(), clienteId: 'CLI003', servicoId: 'SERV001', quantidadeServicos: 1, valorCobrado: 25.00, formaPagamento: FormaPagamento.Dinheiro },
];
