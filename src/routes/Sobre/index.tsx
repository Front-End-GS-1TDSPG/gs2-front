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

  return (
    <div className={`min-h-screen ${isDark ? 'sobre-dark' : 'sobre-light'}`}>
      {/* Hero Section */}
      <section className={`py-16 ${isDark ? 'hero-dark' : 'hero-light'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Sobre a MentalTech
            </h1>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Uma plataforma inovadora dedicada ao monitoramento e promoção do bem-estar 
              e saúde mental no ambiente corporativo
            </p>
          </div>
        </div>
      </section>

      {/* Métricas */}
      <section className={`py-12 text-white ${isDark ? 'metrics-dark' : 'metrics-light'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {metrics.map((metric, index) => (
              <div key={index} className="transform hover:scale-110 transition duration-300">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {metric.value}{metric.suffix}
                </div>
                <div className={isDark ? 'text-blue-200' : 'text-blue-100'}>
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {(Object.keys(tabContent) as TabType[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg font-semibold transition duration-300 ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tabContent[tab].title}
                </button>
              ))}
            </div>
            
            <div className={`p-8 rounded-xl shadow-lg ${isDark ? 'tab-content-dark' : 'tab-content-light'}`}>
              <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {tabContent[activeTab].title}
              </h3>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {tabContent[activeTab].content}
              </p>
            </div>
          </div>
        </div>
      </section>