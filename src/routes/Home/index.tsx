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