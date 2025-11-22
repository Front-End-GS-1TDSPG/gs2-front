export interface TipoContent {
  title: string;
  content: string;
}

export interface TipoContentMap {
  missao: TipoContent;
  visao: TipoContent;
  valores: TipoContent;
}

export type TipoTabType = keyof TipoContentMap;