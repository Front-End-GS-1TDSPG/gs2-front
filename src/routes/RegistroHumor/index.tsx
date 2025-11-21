import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { apiService } from '../../services/apiService';
import type { Empregado, RegistroHumorForm } from '../../types/tipoApi';
import { 
  FiCheck, 
  FiAlertTriangle, 
  FiRefreshCw, 
  FiSave,
  FiUser,
  FiCalendar,
  FiSmile,
  FiFrown,
  FiFileText,
  FiInfo,
  FiHeart,
  FiTrendingUp,
  FiUsers,
  FiEye
} from 'react-icons/fi';
import { 
  MdSentimentVerySatisfied,
  MdSentimentSatisfied,
  MdSentimentNeutral,
  MdSentimentDissatisfied,
  MdSentimentVeryDissatisfied,
  MdSick,
} from 'react-icons/md';
import { 
  IoReload,
  IoWarning,
  IoHappy,
  IoHappyOutline
} from 'react-icons/io5';
import { useTheme } from '../../contexts/useTheme';

export default function RegistroHumor() {
  const { isDark } = useTheme();
  const [empregados, setEmpregados] = useState<Empregado[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEmpregados, setLoadingEmpregados] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<RegistroHumorForm>({
    defaultValues: {
      data_registro: new Date().toISOString().split('T')[0],
      nivel_humor: 3,
      nivel_estresse: 3,
      empregado_id_empregado: 1,
      observacao: ''
    }
  });

  const nivelHumor = watch('nivel_humor');
  const nivelEstresse = watch('nivel_estresse');
  const observacao = watch('observacao');

  const loadEmpregados = useCallback(async () => {
    try {
      setLoadingEmpregados(true);
      setError('');
      const data = await apiService.getEmpregados();
      setEmpregados(data);
    } catch (err) {
      console.error('Erro ao carregar empregados:', err);
      const errorMessage = err instanceof Error ? err.message : 'Tente novamente';
      setError('Erro ao carregar lista de colaboradores: ' + errorMessage);
      
      // Auto-retry após 5 segundos (máximo 3 tentativas)
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 5000);
      }
    } finally {
      setLoadingEmpregados(false);
    }
  }, [retryCount]);

  useEffect(() => {
    loadEmpregados();
  }, [loadEmpregados]);

  const onSubmit = async (data: RegistroHumorForm) => {
    try {
      setLoading(true);
      setError('');
      
      await apiService.createRegistroHumor(data);
      
      setSubmitSuccess(true);
      reset({
        data_registro: new Date().toISOString().split('T')[0],
        nivel_humor: 3,
        nivel_estresse: 3,
        empregado_id_empregado: empregados[0]?.id_empregado || 1,
        observacao: ''
      });
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (err) {
      console.error('Erro ao salvar registro:', err);
      const errorMessage = err instanceof Error ? err.message : 'Verifique sua conexão e tente novamente';
      setError('Erro ao salvar registro de humor: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getHumorIcon = (nivel: number) => {
    switch (nivel) {
      case 1: return <MdSentimentVeryDissatisfied className="text-2xl" />;
      case 2: return <MdSentimentDissatisfied className="text-2xl" />;
      case 3: return <MdSentimentNeutral className="text-2xl" />;
      case 4: return <MdSentimentSatisfied className="text-2xl" />;
      case 5: return <MdSentimentVerySatisfied className="text-2xl" />;
      default: return <MdSentimentNeutral className="text-2xl" />;
    }
  };

  const getEstresseIcon = (nivel: number) => {
    switch (nivel) {
      case 1: return <IoHappy className="text-2xl" />;
      case 2: return <IoHappyOutline className="text-2xl" />;
      case 3: return <MdSentimentNeutral className="text-2xl" />;
      case 4: return <FiFrown className="text-2xl" />;
      case 5: return <MdSick className="text-2xl" />;
      default: return <MdSentimentNeutral className="text-2xl" />;
    }
  };

  const getObservacaoCountColor = (count: number) => {
    if (count < 10) return isDark ? 'text-red-400 bg-red-900 px-2 py-1 rounded' : 'text-red-600 bg-red-50 px-2 py-1 rounded';
    if (count < 20) return isDark ? 'text-yellow-400 bg-yellow-900 px-2 py-1 rounded' : 'text-yellow-600 bg-yellow-50 px-2 py-1 rounded';
    return isDark ? 'text-green-400 bg-green-900 px-2 py-1 rounded' : 'text-green-600 bg-green-50 px-2 py-1 rounded';
  };

  const handleRetry = () => {
    setRetryCount(0);
    setError('');
  };

  // Skeleton Loading para empregados
  if (loadingEmpregados) {
    return (
      <div className={`min-h-screen py-8 ${isDark ? 'registro-humor-dark' : 'registro-humor-light'}`}>
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header Skeleton */}
          <div className="text-center mb-8">
            <div className={`h-12 rounded-lg w-96 mx-auto mb-4 animate-pulse ${
              isDark ? 'bg-gray-700' : 'bg-gray-300'
            }`}></div>
            <div className={`h-6 rounded w-64 mx-auto animate-pulse ${
              isDark ? 'bg-gray-700' : 'bg-gray-300'
            }`}></div>
          </div>

          {/* Form Skeleton */}
          <div className={`rounded-xl shadow-lg p-6 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="mb-6">
                <div className={`h-5 rounded w-32 mb-3 animate-pulse ${
                  isDark ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
                <div className={`h-12 rounded-lg animate-pulse ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
              </div>
            ))}
            <div className={`h-12 rounded-lg animate-pulse ${
              isDark ? 'bg-gray-700' : 'bg-gray-300'
            }`}></div>
          </div>
        </div>
      </div>
    );
  }