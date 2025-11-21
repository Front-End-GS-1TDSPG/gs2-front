import type { FAQItem, FAQCategory } from "../types/tipoFaq";

export const listaFaq: FAQItem[] = [
  {
    id: 1,
    question: "O que é a MentalTech?",
    answer: "A MentalTech é uma plataforma inovadora de monitoramento de bem-estar e saúde mental no ambiente corporativo. Utilizamos tecnologia avançada para acompanhar indicadores de humor, estresse e satisfação dos colaboradores, ajudando empresas a criar ambientes de trabalho mais saudáveis.",
    category: "geral",
    isOpen: false
  },
  {
    id: 2,
    question: "Como funciona o sistema de monitoramento?",
    answer: "O sistema coleta dados através de check-ins regulares dos colaboradores, analisando padrões de humor, níveis de estresse e feedbacks. Utilizamos algoritmos de machine learning para identificar tendências e gerar alertas proativos quando necessário.",
    category: "tecnico",
    isOpen: false
  },
  {
    id: 3,
    question: "Os dados dos colaboradores são seguros?",
    answer: "Sim! Seguimos rigorosos protocolos de segurança e privacidade. Todos os dados são anonimizados e criptografados, seguindo as diretrizes da LGPD. Apenas relatórios agregados são compartilhados com a liderança.",
    category: "seguranca",
    isOpen: false
  },
  {
    id: 4,
    question: "Como faço para criar uma conta?",
    answer: "As contas são criadas através do administrador da sua empresa. Entre em contato com o RH ou gestor responsável para solicitar o acesso ao sistema.",
    category: "conta",
    isOpen: false
  },
  {
    id: 5,
    question: "Quais empresas podem usar a MentalTech?",
    answer: "O sistema é adequado para empresas de todos os tamanhos e segmentos. Desde startups até grandes corporações podem se beneficiar das nossas soluções de monitoramento de bem-estar.",
    category: "empresa",
    isOpen: false
  },
  {
    id: 6,
    question: "Preciso instalar algum software?",
    answer: "Não! A MentalTech é uma plataforma web responsiva que funciona diretamente no navegador. É compatível com computadores, tablets e smartphones.",
    category: "tecnico",
    isOpen: false
  },
  {
    id: 7,
    question: "Como são gerados os alertas de bem-estar?",
    answer: "Os alertas são baseados em algoritmos que analisam padrões de comportamento, frequência de check-ins, níveis reportados de estresse e humor. Quando detectamos anomalias ou tendências preocupantes, o sistema gera alertas para a equipe de RH.",
    category: "tecnico",
    isOpen: false
  },
  {
    id: 8,
    question: "Posso usar o sistema no modo mobile?",
    answer: "Sim! A MentalTech é totalmente responsivo e otimizado para dispositivos móveis. Você pode acessar todas as funcionalidades através do navegador do seu smartphone.",
    category: "tecnico",
    isOpen: false
  },
  {
    id: 9,
    question: "Quanto custa implementar o sistema?",
    answer: "Oferecemos diferentes planos conforme o tamanho da empresa e necessidades específicas. Entre em contato conosco para uma demonstração personalizada e proposta comercial.",
    category: "empresa",
    isOpen: false
  },
  {
    id: 10,
    question: "Como é feito o suporte técnico?",
    answer: "Oferecemos suporte via email, chat e telefone durante o horário comercial. Também temos uma base de conhecimento completa e tutoriais em vídeo disponíveis 24/7.",
    category: "geral",
    isOpen: false
  }
];

export const listaCategorias: FAQCategory[] = [
  { name: 'all', icon: 'FaList' },
  { name: 'geral', icon: 'FaQuestion' },
  { name: 'tecnico', icon: 'FaLaptop' },
  { name: 'conta', icon: 'FaUser' },
  { name: 'seguranca', icon: 'FaLock' },
  { name: 'empresa', icon: 'FaBuilding' }
];