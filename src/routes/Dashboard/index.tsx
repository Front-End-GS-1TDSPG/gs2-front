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

  // Skeleton Loading
  if (loading) {
    return (
      <div className={`min-h-screen py-8 ${isDark ? 'dashboard-dark' : 'dashboard-light'}`}>
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-8">
            <div className={`h-12 rounded-lg w-64 mx-auto mb-4 animate-pulse ${
              isDark ? 'bg-gray-700' : 'bg-gray-300'
            }`}></div>
            <div className={`h-6 rounded w-96 mx-auto animate-pulse ${
              isDark ? 'bg-gray-700' : 'bg-gray-300'
            }`}></div>
          </div>

          {/* Estatísticas Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`rounded-xl shadow-lg p-6 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className={`h-8 rounded w-16 mx-auto mb-2 animate-pulse ${
                  isDark ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
                <div className={`h-4 rounded w-24 mx-auto animate-pulse ${
                  isDark ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
              </div>
            ))}
          </div>

          {/* Conteúdo Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className={`rounded-xl shadow-lg p-6 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className={`h-8 rounded w-48 mb-6 animate-pulse ${
                  isDark ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
                {[...Array(3)].map((_, j) => (
                  <div key={j} className={`flex items-center justify-between p-4 border rounded-lg mb-4 ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div>
                      <div className={`h-5 rounded w-32 mb-2 animate-pulse ${
                        isDark ? 'bg-gray-700' : 'bg-gray-300'
                      }`}></div>
                      <div className={`h-4 rounded w-24 animate-pulse ${
                        isDark ? 'bg-gray-700' : 'bg-gray-300'
                      }`}></div>
                    </div>
                    <div className={`h-6 rounded w-20 animate-pulse ${
                      isDark ? 'bg-gray-700' : 'bg-gray-300'
                    }`}></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && retryCount >= 3) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'dashboard-dark' : 'dashboard-light'
      }`}>
        <div className="text-center max-w-md">
          <MdOutlinePsychology className={`text-6xl mx-auto mb-4 ${
            isDark ? 'text-red-400' : 'text-red-600'
          }`} />
          <h2 className={`text-2xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Erro ao carregar dashboard</h2>
          <p className={`mb-4 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>{error}</p>
          <p className={`text-sm mb-4 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            A API está respondendo lentamente. Tente novamente em alguns instantes.
          </p>
          <button
            onClick={() => {
              setRetryCount(0);
              setError('');
            }}
            className={`px-6 py-2 rounded-lg transition duration-300 flex items-center mx-auto ${
              isDark
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <IoReload className="mr-2" />
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'dashboard-dark' : 'dashboard-light'}`}>
      <div className="container mx-auto px-4">
        {/* Header com indicador de carregamento */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <MdOutlineDashboard className={`mr-3 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`} />
            Dashboard de Bem-Estar
            {error && retryCount < 3 && (
              <span className={`ml-2 text-sm px-2 py-1 rounded flex items-center ${
                isDark ? 'text-orange-400 bg-orange-900' : 'text-orange-600 bg-orange-100'
              }`}>
                <FiRefreshCw className="mr-1 animate-spin" />
                Tentando reconectar... ({retryCount + 1}/3)
              </span>
            )}
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Monitoramento em tempo real do clima organizacional
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {estatisticas.map((stat, index) => (
            <div key={index} className={`rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition duration-300 ${
              isDark ? 'stat-card-dark' : 'stat-card-light'
            }`}>
              <div className="flex justify-center mb-3">
                {stat.icon}
              </div>
              <div className={`text-3xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {stat.valor}
              </div>
              <div className={`font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Últimos Registros de Humor */}
          <div className={`rounded-xl shadow-lg p-6 ${
            isDark ? 'section-dark' : 'section-light'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <FiHeart className={`mr-2 ${
                isDark ? 'text-red-400' : 'text-red-500'
              }`} />
              Últimos Registros de Humor
            </h2>
            <div className="space-y-4">
              {registrosHumor.slice(0, 5).map(registro => (
                <div key={registro.id_registro} className={`flex items-center justify-between p-4 border rounded-lg transition duration-200 ${
                  isDark
                    ? 'border-gray-700 hover:bg-gray-800'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <div className="flex items-center">
                    <FiUser className={`mr-3 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <div>
                      <div className={`font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {empregados.find(e => e.id_empregado === registro.empregado_id_empregado)?.nome || 'Colaborador'}
                      </div>
                      <div className={`text-sm flex items-center ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <FiCalendar className="mr-1" />
                        {new Date(registro.data_registro).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold flex items-center justify-end ${getHumorColor(registro.nivel_humor)}`}>
                      {getHumorIcon(registro.nivel_humor)}
                      <span className="ml-1">Humor: {registro.nivel_humor}/5</span>
                    </div>
                    <div className={`text-sm flex items-center justify-end ${getEstresseColor(registro.nivel_estresse)}`}>
                      <FiActivity className="mr-1" />
                      Estresse: {registro.nivel_estresse}/5
                    </div>
                  </div>
                </div>
              ))}
              {registrosHumor.length === 0 && (
                <div className={`text-center py-8 flex flex-col items-center ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <FiMeh className={`text-4xl mb-2 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  Nenhum registro de humor encontrado
                </div>
              )}
            </div>
          </div>