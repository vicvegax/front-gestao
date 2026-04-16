export interface OrgaoAllDto {
  id: number;
  nome: string;
  sigla: string;
  obs: string;
  ativo: boolean;
}

export interface OrgaoAtivoDto {
  id: number;
  nome: string;
  sigla: string;
}