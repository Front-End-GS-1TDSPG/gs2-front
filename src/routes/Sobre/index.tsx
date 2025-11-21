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

      {/* Modal de Detalhes do Integrante */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl max-w-md w-full p-6 transform scale-95 animate-scaleIn ${
            isDark ? 'modal-dark' : 'modal-light'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Detalhes do Integrante
              </h3>
              <button 
                onClick={closeModal}
                className={`text-2xl ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                &times;
              </button>
            </div>
            
            <div className="text-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 overflow-hidden ${
                isDark ? 'bg-blue-700' : 'bg-blue-600'
              }`}>
                {selectedMember.photo ? (
                  <img 
                    src={selectedMember.photo} 
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  selectedMember.name.split(' ').map(n => n[0]).join('')
                )}
              </div>
              
              <h4 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {selectedMember.name}
              </h4>
              
              <div className={`space-y-2 text-left mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p><strong>RM:</strong> {selectedMember.rm}</p>
                <p><strong>Turma:</strong> {selectedMember.turma}</p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <a 
                  href={selectedMember.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`px-4 py-2 rounded-lg transition duration-300 flex items-center space-x-2 ${
                    isDark
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  }`}
                >
                  <span>GitHub</span>
                </a>
                <a 
                  href={selectedMember.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`px-4 py-2 rounded-lg transition duration-300 flex items-center space-x-2 ${
                    isDark
                      ? 'bg-blue-700 text-white hover:bg-blue-600'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* História */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold text-center mb-8 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Nossa História
            </h2>
            <div className={`p-8 rounded-xl shadow-lg ${isDark ? 'history-dark' : 'history-light'}`}>
              <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                A MentalTech nasceu em 2025 como projeto de Global Solution do Grupo AGJ, 
                fruto da necessidade urgente de abordar a crescente crise de saúde mental no 
                ambiente corporativo.
              </p>
              <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Desenvolvido pelos alunos André Emygdio, Gabriel Müller e João Victor Adão da FIAP, 
                o projeto combina tecnologias modernas como React, TypeScript e Quarkus para 
                criar uma solução completa de monitoramento de bem-estar.
              </p>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Observando os altos índices de burnout, absenteísmo e rotatividade nas empresas, 
                nossa equipe decidiu criar uma solução tecnológica que pudesse prevenir esses 
                problemas através do monitoramento proativo do bem-estar dos colaboradores.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}