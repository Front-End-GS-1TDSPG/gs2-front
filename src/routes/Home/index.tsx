import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiSmile, 
  FiAlertTriangle, 
  FiBarChart2, 
  FiArrowRight,
  FiHeart,
  FiTrendingUp,
  FiUsers,
  FiThumbsUp,
  FiStar,
  FiAward,
  FiTarget
} from 'react-icons/fi';
import { 
  MdOutlineMonitorHeart,
  MdOutlinePsychology,
  MdAnalytics,
  MdHealthAndSafety
} from 'react-icons/md';
import { 
  IoStatsChart,
  IoHappy,
  IoRocket
} from 'react-icons/io5';
import { useTheme } from '../../contexts/useTheme';

export default function Home() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [stats, setStats] = useState([
    { value: 0, label: 'Redução de Burnout', suffix: '%' },
    { value: 0, label: 'Aumento de Produtividade', suffix: '%' },
    { value: 0, label: 'Satisfação dos Colaboradores', suffix: '%' },
    { value: 0, label: 'Redução de Afastamentos', suffix: '%' }
  ]);

  const [features, setFeatures] = useState([
    {
      icon: <FiSmile size={24} />,
      title: 'Monitoramento de Humor',
      description: 'Carregando...',
      color: 'green'
    },
    {
      icon: <FiAlertTriangle size={24} />,
      title: 'Alertas Inteligentes',
      description: 'Carregando...',
      color: 'yellow'
    },
    {
      icon: <FiBarChart2 size={24} />,
      title: 'Analytics em Tempo Real',
      description: 'Carregando...',
      color: 'blue'
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const targetStats = [85, 42, 94, 67];
      setStats(prevStats => 
        prevStats.map((stat, index) => ({
          ...stat,
          value: targetStats[index]
        }))
      );

      setFeatures([
        {
          icon: <MdOutlineMonitorHeart size={24} />,
          title: 'Monitoramento de Humor',
          description: 'Acompanhe diariamente o humor e níveis de estresse dos colaboradores para identificar padrões e necessidades de intervenção proativa.',
          color: 'green'
        },
        {
          icon: <MdOutlinePsychology size={24} />,
          title: 'Alertas Inteligentes',
          description: 'Sistema de alertas proativos baseado em machine learning para situações que requerem atenção especial da equipe de RH.',
          color: 'yellow'
        },
        {
          icon: <MdAnalytics size={24} />,
          title: 'Analytics em Tempo Real',
          description: 'Dashboard completo com métricas avançadas e insights preditivos sobre o bem-estar organizacional.',
          color: 'blue'
        }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [features.length]);

  const handleComecarAgora = () => {
    navigate('/gerenciar-humor');
  };

  const handleSaibaMais = () => {
    navigate('/sobre');
  };

  const handleSolicitarDemonstracao = () => {
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'home-dark' : 'home-light'}`}>
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Monitoramento de 
            <span className={isDark ? 'text-blue-400' : 'text-blue-600'}> Bem-Estar</span>
          </h1>
          <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Promovendo ambientes de trabalho mais saudáveis e sustentáveis através do cuidado com a saúde mental dos colaboradores
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleComecarAgora}
              className={`px-8 py-3 rounded-lg font-semibold transition duration-300 transform hover:scale-105 flex items-center justify-center ${
                isDark
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <IoRocket className="mr-2" />
              Começar Agora
              <FiArrowRight className="ml-2" />
            </button>
            <button 
              onClick={handleSaibaMais}
              className={`border-2 px-8 py-3 rounded-lg font-semibold transition duration-300 transform hover:scale-105 flex items-center justify-center ${
                isDark
                  ? 'border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900'
                  : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
              }`}
            >
              <FiTarget className="mr-2" />
              Saiba Mais
            </button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`p-6 rounded-xl shadow-lg transition-all duration-500 transform ${
                isDark ? 'feature-card-dark' : 'feature-card-light'
              } ${activeFeature === index ? 'scale-105 shadow-xl' : 'scale-100'}`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                feature.color === 'green' ? (
                  isDark ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600'
                ) : feature.color === 'yellow' ? (
                  isDark ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
                ) : (
                  isDark ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'
                )
              }`}>
                {feature.icon}
              </div>
              <h3 className={`text-xl font-bold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {feature.title}
              </h3>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className={`py-16 ${isDark ? 'stats-section-dark' : 'stats-section-light'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="transform hover:scale-110 transition duration-300">
                <div className="flex justify-center mb-3">
                  {index === 0 && <FiHeart className={`text-3xl ${
                    isDark ? 'text-red-400' : 'text-red-500'
                  }`} />}
                  {index === 1 && <FiTrendingUp className={`text-3xl ${
                    isDark ? 'text-green-400' : 'text-green-500'
                  }`} />}
                  {index === 2 && <IoHappy className={`text-3xl ${
                    isDark ? 'text-yellow-400' : 'text-yellow-500'
                  }`} />}
                  {index === 3 && <MdHealthAndSafety className={`text-3xl ${
                    isDark ? 'text-blue-400' : 'text-blue-500'
                  }`} />}
                </div>
                <div className={`text-3xl md:text-4xl font-bold mb-2 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {stat.value}{stat.suffix}
                </div>
                <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 text-center">
        <div className={`rounded-2xl p-8 md:p-12 text-white ${
          isDark 
            ? 'cta-section-dark' 
            : 'cta-section-light'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center">
            <FiStar className="mr-3" />
            Pronto para transformar o bem-estar na sua empresa?
            <FiStar className="ml-3" />
          </h2>
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${
            isDark ? 'text-blue-200' : 'text-blue-100'
          }`}>
            Junte-se a empresas visionárias que já estão investindo na saúde mental de seus colaboradores
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleSolicitarDemonstracao}
              className={`px-8 py-3 rounded-lg font-semibold transition duration-300 transform hover:scale-105 flex items-center justify-center ${
                isDark
                  ? 'bg-white text-blue-700 hover:bg-gray-100'
                  : 'bg-white text-blue-600 hover:bg-gray-100'
              }`}
            >
              <FiUsers className="mr-2" />
              Solicitar Demonstração
            </button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <FiThumbsUp className={`inline mr-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            Benefícios Comprovados
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Empresas que investem em bem-estar mental observam resultados significativos
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <IoStatsChart size={32} />, title: 'Métricas Precisas', desc: 'Dados em tempo real' },
            { icon: <FiUsers size={32} />, title: 'Equipe Engajada', desc: 'Maior participação' },
            { icon: <FiTrendingUp size={32} />, title: 'Crescimento Sustentável', desc: 'Resultados duradouros' },
            { icon: <FiAward size={32} />, title: 'Reconhecimento', desc: 'Melhores práticas' }
          ].map((item, index) => (
            <div key={index} className={`p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition duration-300 ${
              isDark ? 'benefit-card-dark' : 'benefit-card-light'
            }`}>
              <div className={`mb-4 flex justify-center ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {item.icon}
              </div>
              <h3 className={`text-lg font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {item.title}
              </h3>
              <p className={isDark ? 'text-gray-300 text-sm' : 'text-gray-600 text-sm'}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}