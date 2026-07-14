export type StatusDenuncia =
  | 'RECEBIDA'
  | 'EM_ANALISE'
  | 'EM_INVESTIGACAO'
  | 'AGUARDANDO_INFORMACOES'
  | 'CONCLUIDA'
  | 'ARQUIVADA';

export type TipoDenuncia =
  | 'ASSEDIO'
  | 'FRAUDE'
  | 'CORRUPCAO'
  | 'DISCRIMINACAO'
  | 'INFRAESTRUTURA'
  | 'OUTROS';

export interface Denunciante {
  nome: string;
  email: string;
  telefone?: string;
}

export interface Anexo {
  id: string;      // fileId no Google Drive
  nome: string;
  tamanho: number;
  tipo: string;
}

export interface Denuncia {
  id: string;
  protocolo: string;
  anonima: boolean;
  denunciante: Denunciante | null;
  tipo: TipoDenuncia;
  local: string;
  dataOcorrido: string;
  pessoasEnvolvidas?: string;
  descricao: string;
  anexos: Anexo[];
  status: StatusDenuncia;
  criadoEm: string;
  atualizadoEm: string;
}

export interface HistoricoMovimentacao {
  id: string;
  denunciaId: string;
  status: StatusDenuncia;
  mensagem: string;
  observacaoInterna?: string;
  criadoEm: string;
  criadoPor: string;
}

export interface DashboardMetrics {
  total: number;
  emAnalise: number;
  concluidas: number;
  arquivadas: number;
}