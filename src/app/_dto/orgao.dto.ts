export interface ContasAllDto {
  id: number;
  nome: string;
  sigla: string;
  obs: string;
  ativo: boolean;
}

export interface ContaAtivoDto {
  id: number;
  codigo: string;
  nome: string;
}