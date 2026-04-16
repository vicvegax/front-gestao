import {Decimal} from 'decimal.js';

export interface MovimentoListResponse {
  data: MovimentoDto[];
  saldo_anterior: number;
}

export interface MovimentoDto {
  id: number;
  tipoMovimento: string;
  situacaoInicial: string;
  situacaoMovimento: string;
  idConta: number;
  unidade: {
    id: number;
    nome: string;
  };
  evento: {
    id: number;
    nome: string;
  };
  pessoal: {
    id: number;
    inscricao: string;
    nome: string;
  };
  tipoDocumento: {
    id: number;
    nome: string;
  };
  numeroDocumento: string;
  valor: string;
  natureza: string;
  dataVencimento: string;
  competencia: string;
  descricao: string;
  obs: string;
}

export interface MovimentoDashBoardDto {
  anterior: Decimal;
  credito: Decimal;
  debito: Decimal;
  em_conta: Decimal;
}