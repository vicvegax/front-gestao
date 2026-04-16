import {Decimal} from 'decimal.js';

export interface MovimentoDto {
  id: number;
}

export interface MovimentoDashBoardDto {
  anterior: Decimal;
  credito: Decimal;
  debito: Decimal;
  em_conta: Decimal;
}