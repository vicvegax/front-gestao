import {Decimal} from 'decimal.js';
import { DateTime } from 'luxon';

export interface MovimentoListResponse<T> {
  data: T[];
  credito: string;
  debito: string;
  anterior: string;
  emConta: string;
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
  natureza: string;
  obs: string;
  competencia: string;
  descricao: string;
  ultimaParcela?: number;
  //OMITIDOS
  valor: string;
  dataVencimento: string;
  dataBaixa?: string;
  dataEfetivou?: string;
  dataEntregou?: string;
}

export interface Movimento extends Omit<MovimentoDto, 'valor' | 'dataVencimento' | 'dataBaixa' | 'dataEfetivou' | 'dataEntregou'>{
  valor: Decimal;
  dataVencimento: DateTime;
  dataBaixa?: DateTime;
  dataEfetivou?: DateTime;
  dataEntregou?: DateTime;
}

export interface MovimentoDashBoardDto {
  anterior: Decimal;
  credito: Decimal;
  debito: Decimal;
  em_conta: Decimal;
}