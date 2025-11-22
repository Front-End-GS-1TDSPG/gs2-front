export type RegistroHumor = {
  id_registro: number;
  data_registro: string;
  nivel_humor: number;
  nivel_estresse: number;
  observacao: string;
  empregado_id_empregado: number;
};

export type Empregado = {
  id_empregado: number;
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  tipo_colaborador: string;
  id_departamento: number;
};

export type Departamento = {
  id_departamento: number;
  nome_departamento: string;
  descricao: string;
  quantidade_colaboradores: number;
};

export type AlertaBemEstar = {
  id_alerta: number;
  tipo_alerta: string;
  descricao_alerta: string;
  nivel_risco: string;
  data_geracao: string;
  empregado_id_empregado: number;
};

export type RegistroHumorForm = {
  data_registro: string;
  nivel_humor: number;
  nivel_estresse: number;
  observacao: string;
  empregado_id_empregado: number;
};