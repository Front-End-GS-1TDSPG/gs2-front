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

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'registro-humor-dark' : 'registro-humor-light'}`}>
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Registro de Humor Diário
            {error && retryCount < 3 && (
              <span className={`ml-2 text-sm px-2 py-1 rounded ${
                isDark ? 'text-orange-400 bg-orange-900' : 'text-orange-600 bg-orange-100'
              }`}>
                Tentando carregar... ({retryCount + 1}/3)
              </span>
            )}
          </h1>
          <p className={`text-xl ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Como você está se sentindo hoje? Compartilhe seu estado emocional.
          </p>
        </div>

        {/* Formulário */}
        <div className={`rounded-xl shadow-lg p-6 ${
          isDark ? 'form-container-dark' : 'form-container-light'
        }`}>
          {submitSuccess && (
            <div className={`rounded-lg p-4 mb-6 animate-fade-in ${
              isDark ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center">
                <FiCheck className={`text-lg mr-2 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`} />
                <p className={isDark ? 'text-green-100 font-medium' : 'text-green-800 font-medium'}>
                  Registro de humor salvo com sucesso!
                </p>
              </div>
              <p className={`text-sm mt-1 ${
                isDark ? 'text-green-200' : 'text-green-700'
              }`}>
                Seu registro foi armazenado e contribui para o monitoramento do bem-estar da equipe.
              </p>
            </div>
          )}

          {error && retryCount >= 3 && (
            <div className={`rounded-lg p-4 mb-6 ${
              isDark ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center">
                <IoWarning className={`text-lg mr-2 ${
                  isDark ? 'text-red-400' : 'text-red-600'
                }`} />
                <div>
                  <p className={isDark ? 'text-red-100 font-medium' : 'text-red-800 font-medium'}>
                    {error}
                  </p>
                  <p className={`text-sm mt-1 ${
                    isDark ? 'text-red-200' : 'text-red-700'
                  }`}>
                    A API está respondendo lentamente. Tente novamente.
                  </p>
                </div>
              </div>
              <button
                onClick={handleRetry}
                className={`mt-3 px-4 py-2 rounded-lg transition duration-300 text-sm flex items-center ${
                  isDark
                    ? 'bg-red-700 text-white hover:bg-red-600'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                <IoReload className="mr-2" />
                Tentar Novamente
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Empregado */}
            <div>
              <label className={`text-sm font-medium mb-2 flex items-center ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                <FiUser className="mr-1" />
                Colaborador *
              </label>
              <select
                {...register('empregado_id_empregado', { required: 'Selecione um colaborador' })}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 disabled:cursor-not-allowed ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-800'
                    : 'border-gray-300 disabled:bg-gray-100'
                }`}
                disabled={empregados.length === 0}
              >
                <option value="">
                  {empregados.length === 0 ? 'Nenhum colaborador disponível' : 'Selecione um colaborador'}
                </option>
                {empregados.map(emp => (
                  <option key={emp.id_empregado} value={emp.id_empregado}>
                    {emp.nome} - {emp.tipo_colaborador}
                  </option>
                ))}
              </select>
              {errors.empregado_id_empregado && (
                <p className="text-red-500 text-sm mt-1">{errors.empregado_id_empregado.message}</p>
              )}
              {empregados.length === 0 && !error && (
                <p className={`text-sm mt-1 flex items-center ${
                  isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`}>
                  <FiAlertTriangle className="mr-1" />
                  Nenhum colaborador cadastrado. Entre em contato com o administrador.
                </p>
              )}
            </div>

            {/* Data */}
            <div>
              <label className={`text-sm font-medium mb-2 flex items-center ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                <FiCalendar className="mr-1" />
                Data do Registro *
              </label>
              <input
                type="date"
                {...register('data_registro', { required: 'Data é obrigatória' })}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-300'
                }`}
              />
              {errors.data_registro && (
                <p className="text-red-500 text-sm mt-1">{errors.data_registro.message}</p>
              )}
            </div>

            {/* Nível de Humor */}
            <div className={`rounded-lg p-4 border ${
              isDark ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'
            }`}>
              <label className={`text-sm font-medium mb-4 flex items-center justify-between ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                <span className="flex items-center">
                  <FiSmile className="mr-1" />
                  Nível de Humor:
                </span>
                <span className="text-2xl">{getHumorIcon(nivelHumor)}</span>
              </label>
              <div className="flex items-center space-x-4 mb-3">
                <span className={`text-sm whitespace-nowrap flex items-center ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <MdSentimentVeryDissatisfied className="mr-1" />
                  Muito Triste
                </span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  {...register('nivel_humor', { 
                    required: 'Nível de humor é obrigatório',
                    valueAsNumber: true 
                  })}
                  className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer ${
                    isDark ? 'bg-blue-700' : 'bg-blue-200'
                  }`}
                />
                <span className={`text-sm whitespace-nowrap flex items-center ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <MdSentimentVerySatisfied className="mr-1" />
                  Muito Feliz
                </span>
              </div>
              <div className="text-center">
                <span className={`text-lg font-semibold px-3 py-1 rounded-full border ${
                  isDark 
                    ? 'text-blue-400 bg-gray-800 border-blue-600' 
                    : 'text-blue-600 bg-white border-blue-200'
                }`}>
                  {nivelHumor}/5
                </span>
              </div>
              {errors.nivel_humor && (
                <p className="text-red-500 text-sm mt-1 text-center">{errors.nivel_humor.message}</p>
              )}
            </div>

            {/* Nível de Estresse */}
            <div className={`rounded-lg p-4 border ${
              isDark ? 'bg-orange-900 border-orange-700' : 'bg-orange-50 border-orange-200'
            }`}>
              <label className={`text-sm font-medium mb-4 flex items-center justify-between ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                <span className="flex items-center">
                  <FiFrown className="mr-1" />
                  Nível de Estresse:
                </span>
                <span className="text-2xl">{getEstresseIcon(nivelEstresse)}</span>
              </label>
              <div className="flex items-center space-x-4 mb-3">
                <span className={`text-sm whitespace-nowrap flex items-center ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <IoHappy className="mr-1" />
                  Muito Calmo
                </span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  {...register('nivel_estresse', { 
                    required: 'Nível de estresse é obrigatório',
                    valueAsNumber: true 
                  })}
                  className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer ${
                    isDark ? 'bg-orange-700' : 'bg-orange-200'
                  }`}
                />
                <span className={`text-sm whitespace-nowrap flex items-center ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <MdSick className="mr-1" />
                  Muito Estressado
                </span>
              </div>
              <div className="text-center">
                <span className={`text-lg font-semibold px-3 py-1 rounded-full border ${
                  isDark 
                    ? 'text-orange-400 bg-gray-800 border-orange-600' 
                    : 'text-orange-600 bg-white border-orange-200'
                }`}>
                  {nivelEstresse}/5
                </span>
              </div>
              {errors.nivel_estresse && (
                <p className="text-red-500 text-sm mt-1 text-center">{errors.nivel_estresse.message}</p>
              )}
            </div>

            {/* Observações */}
            <div className={`rounded-lg p-4 border ${
              isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <label className={`text-sm font-medium flex items-center ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  <FiFileText className="mr-1" />
                  Observações *
                </label>
                <span className={`text-sm font-medium ${getObservacaoCountColor(observacao.length)}`}>
                  {observacao.length}/1000 caracteres
                </span>
              </div>
              <textarea
                rows={4}
                {...register('observacao', { 
                  required: 'Observações são obrigatórias',
                  minLength: {
                    value: 10,
                    message: 'As observações devem ter pelo menos 10 caracteres'
                  },
                  maxLength: {
                    value: 1000,
                    message: 'As observações não podem exceder 1000 caracteres'
                  }
                })}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 resize-none ${
                  isDark 
                    ? 'bg-gray-600 border-gray-500 text-white' 
                    : 'border-gray-300'
                }`}
                placeholder="Descreva como está se sentindo, o que está acontecendo no seu dia, fatores que estão influenciando seu humor, etc..."
              />
              {errors.observacao && (
                <p className="text-red-500 text-sm mt-1">{errors.observacao.message}</p>
              )}
              <div className={`mt-1 text-xs flex items-center ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <FiAlertTriangle className="mr-1" />
                Mínimo 10 caracteres - Compartilhe detalhes sobre seu estado emocional
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || empregados.length === 0}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition duration-300 flex items-center justify-center ${
                loading || empregados.length === 0
                  ? 'bg-gray-500 cursor-not-allowed'
                  : isDark
                    ? 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
                    : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Salvando...
                </div>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Salvar Registro de Humor
                </>
              )}
            </button>
          </form>
        </div>

        {/* Informações */}
        <div className={`mt-8 rounded-xl p-6 border ${
          isDark ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 flex items-center ${
            isDark ? 'text-blue-100' : 'text-blue-900'
          }`}>
            <FiInfo className="mr-2" />
            Por que registrar seu humor?
          </h3>
          <ul className={`space-y-2 ${
            isDark ? 'text-blue-200' : 'text-blue-800'
          }`}>
            <li className="flex items-start">
              <FiHeart className={`mr-2 mt-1 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
              Ajuda no monitoramento da saúde mental da equipe
            </li>
            <li className="flex items-start">
              <FiTrendingUp className={`mr-2 mt-1 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
              Identifica padrões e tendências emocionais
            </li>
            <li className="flex items-start">
              <FiEye className={`mr-2 mt-1 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
              Permite intervenções proativas quando necessário
            </li>
            <li className="flex items-start">
              <FiUsers className={`mr-2 mt-1 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
              Contribui para um ambiente de trabalho mais saudável
            </li>
            <li className="flex items-start">
              <FiFileText className={`mr-2 mt-1 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
              As observações detalhadas ajudam a entender o contexto
            </li>
          </ul>
        </div>

        {/* Botão de recarregar colaboradores */}
        {error && (
          <div className="mt-6 text-center">
            <button
              onClick={handleRetry}
              className={`px-6 py-2 rounded-lg transition duration-300 flex items-center mx-auto ${
                isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FiRefreshCw className="mr-2" />
              Recarregar Colaboradores
            </button>
          </div>
        )}
      </div>
    </div>
  );
}