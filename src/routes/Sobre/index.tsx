import { useState, useEffect } from 'react';
import type { TipoIntegrantes } from '../../types/tipoIntegrantes';
import { useTheme } from '../../contexts/useTheme';

type TabType = 'missao' | 'visao' | 'valores';

interface TabContent {
  title: string;
  content: string;
}

interface TabContentMap {
  missao: TabContent;
  visao: TabContent;
  valores: TabContent;
}

export default function Sobre() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('missao');
  const [selectedMember, setSelectedMember] = useState<TipoIntegrantes | null>(null);

  const [metrics, setMetrics] = useState([
    { label: 'Empresas Atendidas', value: 0, suffix: '+' },
    { label: 'Colaboradores Impactados', value: 0, suffix: 'K+' },
    { label: 'Ano(s) no Mercado', value: 0 },
    { label: 'Satisfação do Cliente', value: 0, suffix: '%' }
  ]);

  useEffect(() => {
    const targetMetrics = [150, 25, 1, 98];
    
    const timer = setTimeout(() => {
      setMetrics(prevMetrics => 
        prevMetrics.map((metric, index) => ({
          ...metric,
          value: targetMetrics[index]
        }))
      );
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const tabContent: TabContentMap = {
    missao: {
      title: "Nossa Missão",
      content: "Promover ambientes de trabalho mais saudáveis e humanos através da tecnologia, reduzindo os índices de burnout e aumentando a qualidade de vida dos colaboradores."
    },
    visao: {
      title: "Nossa Visão",
      content: "Ser referência nacional em soluções de monitoramento de bem-estar corporativo, transformando a cultura organizacional das empresas brasileiras até 2030."
    },
    valores: {
      title: "Nossos Valores",
      content: "Transparência, empatia, inovação e compromisso com a saúde mental. Acreditamos que empresas saudáveis são mais produtivas e sustentáveis."
    }
  };

  const closeModal = () => {
    setSelectedMember(null);
  };