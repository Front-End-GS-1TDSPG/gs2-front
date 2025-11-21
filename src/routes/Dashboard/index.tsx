import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/apiService';
import type { AlertaBemEstar, Departamento, Empregado, RegistroHumor } from '../../types/tipoApi';
import { 
  FiRefreshCw, 
  FiAlertTriangle, 
  FiUsers, 
  FiHeart,
  FiActivity,
  FiTrendingUp,
  FiMeh,
  FiHome,
  FiBarChart2,
  FiBell,
  FiUser,
  FiCalendar,
} from 'react-icons/fi';
import { 
  MdOutlineDashboard,
  MdOutlinePsychology,
  MdGroups,
  MdWarning,
  MdError,
  MdInfo
} from 'react-icons/md';
import { 
  IoReload,
  IoWarning,
  IoHappy,
  IoSad
} from 'react-icons/io5';
import { useTheme } from '../../contexts/useTheme';

export default function Dashboard() {
  const { isDark } = useTheme();
  const [registrosHumor, setRegistrosHumor] = useState<RegistroHumor[]>([]);
  const [empregados, setEmpregados] = useState<Empregado[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [alertas, setAlertas] = useState<AlertaBemEstar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Carregar dados sequencialmente para evitar sobrecarga
      const humorData = await apiService.getRegistrosHumor();
      setRegistrosHumor(humorData);

      const empregadosData = await apiService.getEmpregados();
      setEmpregados(empregadosData);

      const departamentosData = await apiService.getDepartamentos();
      setDepartamentos(departamentosData);

      const alertasData = await apiService.getAlertas();
      setAlertas(alertasData);

    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard';
      setError(errorMessage);
      
      // Auto-retry após 5 segundos (máximo 3 tentativas)
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Calcular estatísticas
  const estatisticas = [
    {
      valor: registrosHumor.length,
      label: 'Registros Hoje',
      icon: <FiActivity className={`text-2xl ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />,
      cor: 'blue'
    },
    {
      valor: empregados.length,
      label: 'Total Colaboradores',
      icon: <FiUsers className={`text-2xl ${isDark ? 'text-green-400' : 'text-green-600'}`} />,
      cor: 'green'
    },
    {
      valor: alertas.filter(a => a.nivel_risco === 'CRITICO' || a.nivel_risco === 'ALTO').length,
      label: 'Alertas Ativos',
      icon: <FiAlertTriangle className={`text-2xl ${isDark ? 'text-red-400' : 'text-red-600'}`} />,
      cor: 'red'
    },
    {
      valor: departamentos.length,
      label: 'Departamentos',
      icon: <FiHome className={`text-2xl ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />,
      cor: 'purple'
    }
  ];

  const getHumorColor = (nivel: number) => {
    if (nivel >= 4) return isDark ? 'text-green-400' : 'text-green-600';
    if (nivel >= 3) return isDark ? 'text-yellow-400' : 'text-yellow-600';
    return isDark ? 'text-red-400' : 'text-red-600';
  };

  const getEstresseColor = (nivel: number) => {
    if (nivel <= 2) return isDark ? 'text-green-400' : 'text-green-600';
    if (nivel <= 3) return isDark ? 'text-yellow-400' : 'text-yellow-600';
    return isDark ? 'text-red-400' : 'text-red-600';
  };

  const getAlertaColor = (nivel: string) => {
    switch (nivel) {
      case 'CRITICO': return isDark ? 'bg-red-900 text-red-200 border-red-700' : 'bg-red-100 text-red-800 border-red-200';
      case 'ALTO': return isDark ? 'bg-orange-900 text-orange-200 border-orange-700' : 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIO': return isDark ? 'bg-yellow-900 text-yellow-200 border-yellow-700' : 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return isDark ? 'bg-blue-900 text-blue-200 border-blue-700' : 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getAlertaIcon = (nivel: string) => {
    switch (nivel) {
      case 'CRITICO': return <MdError className="text-lg" />;
      case 'ALTO': return <MdWarning className="text-lg" />;
      case 'MEDIO': return <IoWarning className="text-lg" />;
      default: return <MdInfo className="text-lg" />;
    }
  };

  const getHumorIcon = (nivel: number) => {
    if (nivel >= 4) return <IoHappy className={isDark ? 'text-green-400' : 'text-green-600'} />;
    if (nivel >= 3) return <FiMeh className={isDark ? 'text-yellow-400' : 'text-yellow-600'} />;
    return <IoSad className={isDark ? 'text-red-400' : 'text-red-600'} />;
  };