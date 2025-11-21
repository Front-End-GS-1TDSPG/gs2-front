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

  // Simula carregamento de dados da API
  useEffect(() => {
    const timer = setTimeout(() => {
      // Atualiza estatísticas com animação
      const targetStats = [85, 42, 94, 67];
      setStats(prevStats => 
        prevStats.map((stat, index) => ({
          ...stat,
          value: targetStats[index]
        }))
      );

      // Atualiza features
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
      {/* Hero Section */}
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