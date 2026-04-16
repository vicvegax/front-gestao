import { UsuarioNivel } from "@app/_helpers/usuario-nivel.enum";

export interface UsuarioAuthDto {
  id: number;
  nome: string;
  access_token: string;
  nivel: UsuarioNivel;
  modoDev?: boolean;
}

export interface UsuarioAllDto {
  id: number,
  cpf: string,
  nome: string,
  nivel: UsuarioNivel,
  ativo: boolean,
  // nivel: string,
}