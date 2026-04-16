export interface BeneficiarioListaDto {
  id: number,
  nome: string,
  cpf: string,
  telefone?: string,
  // tipoCadastro: TipoCadastro,
  ativo: boolean
}

export interface BeneficiarioAllDto {
  id: number,
  foto?: string;
  cpf: string;
  nome: string;
  matricula?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  pontoReferencia?: string;
  telefone?: string;
  contatoEmergencia?: string;
  sexo?: string;
  dataNascimento?: string;
  dataFalecimento?: string;
  rg?: string;
  orgaoExpedidor?: string;
  naturalidade?: string;
  orgaoId?: number;
  cargoId?: number;
  estadoCivilId?: number;
  grauInstrucaoId?: number;
  tipoAposentadoriaId?: number;
  dataAposentadoria?: string;
  dataRecadastro?: string;
  grupoSanguineo?: string;
  contrachequeEmCasa?: boolean;
  medicacoes?: string;
  obs?: string;
  tipoCadastroId?: number;
  ativo?: boolean;
}