import type { TipoAssunto, TipoContato } from "../types/tipoContato";

export const listaContato: TipoContato[] = [
  {
    id: 1,
    tipo: 'email',
    valor: 'contato@mentaltech.com',
    icone: 'FaEnvelope',
    descricao: 'Nosso email principal',
    cor: 'blue'
  },
  {
    id: 2,
    tipo: 'telefone',
    valor: '(11) 3772-3828',
    icone: 'FaPhone',
    descricao: 'Horário comercial',
    cor: 'green'
  },
  {
    id: 3,
    tipo: 'whatsapp',
    valor: '(11) 9525-6800',
    icone: 'FaWhatsapp',
    descricao: 'Atendimento rápido',
    cor: 'green'
  },
  {
    id: 4,
    tipo: 'endereco',
    valor: 'Av. Paulista, 1106 - São Paulo/SP',
    icone: 'FaMapMarkerAlt',
    descricao: 'Nossa sede',
    cor: 'red'
  }
];

export const listaAssuntos: TipoAssunto[] = [
  'Dúvida sobre o produto',
  'Solicitar demonstração',
  'Suporte técnico',
  'Parceria comercial',
  'Trabalhe conosco',
  'Outro'
];