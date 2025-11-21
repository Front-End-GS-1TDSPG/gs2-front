import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { apiService } from '../../services/apiService';
import type { Empregado, RegistroHumor, RegistroHumorForm } from '../../types/tipoApi';
import { 
  FiEdit, 
  FiTrash2, 
  FiCheck, 
  FiX, 
  FiRefreshCw, 
  FiAlertTriangle,
  FiUser,
  FiCalendar,
  FiSmile,
  FiFrown,
  FiFileText,
  FiPlus,
  FiSave,
  FiArrowUp,
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
  IoHappyOutline,
  IoSadOutline
} from 'react-icons/io5';
import { useTheme } from '../../contexts/useTheme';

export default function GerenciarHumor() {
  const { isDark } = useTheme();
  const [registros, setRegistros] = useState<RegistroHumor[]>([]);
  const [empregados, setEmpregados] = useState<Empregado[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [filterEmpregado, setFilterEmpregado] = useState<number | ''>('');
  const [filterDate, setFilterDate] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<RegistroHumorForm>({
    defaultValues: {
      data_registro: new Date().toISOString().split('T')[0],
      nivel_humor: 3,
      nivel_estresse: 3,
      observacao: ''
    }
  });

  const nivelHumor = watch('nivel_humor');
  const nivelEstresse = watch('nivel_estresse');
  const observacao = watch('observacao');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Carregar sequencialmente para melhor performance
      const empregadosData = await apiService.getEmpregados();
      setEmpregados(empregadosData);
      
      const registrosData = await apiService.getRegistrosHumor();
      setRegistros(registrosData);
      
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      const errorMessage = err instanceof Error ? err.message : 'Tente novamente';
      setError('Erro ao carregar dados: ' + errorMessage);
      
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
    loadData();
  }, [loadData]);

  const onSubmit = async (data: RegistroHumorForm) => {
    try {
      setLoadingAction(true);
      setError('');
      
      if (editingId) {
        await apiService.updateRegistroHumor(editingId, data);
        setSuccessMessage('Registro atualizado com sucesso!');
      } else {
        await apiService.createRegistroHumor(data);
        setSuccessMessage('Registro criado com sucesso!');
      }
      
      await loadData();
      resetForm();
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
    } catch (err) {
      console.error('Erro ao salvar registro:', err);
      const errorMessage = err instanceof Error ? err.message : 'Verifique sua conexão';
      setError(`Erro ao ${editingId ? 'atualizar' : 'criar'} registro de humor: ` + errorMessage);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleEdit = (registro: RegistroHumor) => {
    setEditingId(registro.id_registro);
    setValue('data_registro', registro.data_registro);
    setValue('nivel_humor', registro.nivel_humor);
    setValue('nivel_estresse', registro.nivel_estresse);
    setValue('observacao', registro.observacao || '');
    setValue('empregado_id_empregado', registro.empregado_id_empregado);
    
    document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    try {
      setLoadingAction(true);
      await apiService.deleteRegistroHumor(id);
      await loadData();
      setDeleteConfirm(null);
      setSuccessMessage('Registro excluído com sucesso!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
    } catch (err) {
      console.error('Erro ao deletar:', err);
      const errorMessage = err instanceof Error ? err.message : 'Tente novamente';
      setError('Erro ao deletar registro de humor: ' + errorMessage);
    } finally {
      setLoadingAction(false);
    }
  };

  const resetForm = () => {
    reset({
      data_registro: new Date().toISOString().split('T')[0],
      nivel_humor: 3,
      nivel_estresse: 3,
      observacao: '',
      empregado_id_empregado: empregados[0]?.id_empregado || 1
    });
    setEditingId(null);
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
      case 4: return <IoSadOutline className="text-2xl" />;
      case 5: return <MdSick className="text-2xl" />;
      default: return <MdSentimentNeutral className="text-2xl" />;
    }
  };

  const getHumorColor = (nivel: number) => {
    if (nivel >= 4) return isDark ? 'text-green-400 bg-green-900 border-green-700' : 'text-green-600 bg-green-50 border-green-200';
    if (nivel >= 3) return isDark ? 'text-yellow-400 bg-yellow-900 border-yellow-700' : 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return isDark ? 'text-red-400 bg-red-900 border-red-700' : 'text-red-600 bg-red-50 border-red-200';
  };

  const getEstresseColor = (nivel: number) => {
    if (nivel <= 2) return isDark ? 'text-green-400 bg-green-900 border-green-700' : 'text-green-600 bg-green-50 border-green-200';
    if (nivel <= 3) return isDark ? 'text-yellow-400 bg-yellow-900 border-yellow-700' : 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return isDark ? 'text-red-400 bg-red-900 border-red-700' : 'text-red-600 bg-red-50 border-red-200';
  };

  const getEmpregadoNome = (empregadoId: number) => {
    return empregados.find(e => e.id_empregado === empregadoId)?.nome || 'Colaborador não encontrado';
  };

  const getObservacaoCountColor = (count: number) => {
    if (count < 10) return isDark ? 'text-red-400 bg-red-900 px-2 py-1 rounded' : 'text-red-600 bg-red-50 px-2 py-1 rounded';
    if (count < 20) return isDark ? 'text-yellow-400 bg-yellow-900 px-2 py-1 rounded' : 'text-yellow-600 bg-yellow-50 px-2 py-1 rounded';
    return isDark ? 'text-green-400 bg-green-900 px-2 py-1 rounded' : 'text-green-600 bg-green-50 px-2 py-1 rounded';
  };

  const filteredRegistros = registros.filter(registro => {
    const matchesEmpregado = filterEmpregado === '' || registro.empregado_id_empregado === filterEmpregado;
    const matchesDate = filterDate === '' || registro.data_registro === filterDate;
    return matchesEmpregado && matchesDate;
  });

  const handleRetry = () => {
    setRetryCount(0);
    setError('');
  };

  // Skeleton Loading
  if (loading) {
    return (
      <div className={`min-h-screen py-8 ${isDark ? 'gerenciar-humor-dark' : 'gerenciar-humor-light'}`}>
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-8">
            <div className={`h-12 rounded-lg w-96 mx-auto mb-4 animate-pulse ${
              isDark ? 'bg-gray-700' : 'bg-gray-300'
            }`}></div>
            <div className={`h-6 rounded w-64 mx-auto animate-pulse ${
              isDark ? 'bg-gray-700' : 'bg-gray-300'
            }`}></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lista Skeleton */}
            <div>
              <div className={`h-8 rounded w-48 mb-6 animate-pulse ${
                isDark ? 'bg-gray-700' : 'bg-gray-300'
              }`}></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`rounded-xl shadow-lg p-6 border ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className={`h-6 rounded w-32 mb-2 animate-pulse ${
                          isDark ? 'bg-gray-700' : 'bg-gray-300'
                        }`}></div>
                        <div className={`h-4 rounded w-24 animate-pulse ${
                          isDark ? 'bg-gray-700' : 'bg-gray-300'
                        }`}></div>
                      </div>
                      <div className="flex space-x-2">
                        <div className={`h-8 w-8 rounded animate-pulse ${
                          isDark ? 'bg-gray-700' : 'bg-gray-300'
                        }`}></div>
                        <div className={`h-8 w-8 rounded animate-pulse ${
                          isDark ? 'bg-gray-700' : 'bg-gray-300'
                        }`}></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {[...Array(2)].map((_, j) => (
                        <div key={j} className={`h-20 rounded-lg animate-pulse ${
                          isDark ? 'bg-gray-700' : 'bg-gray-200'
                        }`}></div>
                      ))}
                    </div>
                    <div className={`h-4 rounded animate-pulse ${
                      isDark ? 'bg-gray-700' : 'bg-gray-300'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Skeleton */}
            <div>
              <div className={`rounded-xl shadow-lg p-6 sticky top-6 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className={`h-8 rounded w-48 mb-6 animate-pulse ${
                  isDark ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
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
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'gerenciar-humor-dark' : 'gerenciar-humor-light'}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Gerenciar Registros de Humor
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
            Visualize, edite e gerencie todos os registros de humor da equipe
          </p>
        </div>

        {successMessage && (
          <div className={`rounded-lg p-4 mb-6 animate-fade-in ${
            isDark ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center">
              <FiCheck className={`text-lg mr-2 ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`} />
              <p className={isDark ? 'text-green-100 font-medium' : 'text-green-800 font-medium'}>
                {successMessage}
              </p>
            </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lista de Registros */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Registros ({filteredRegistros.length})
                <span className={`text-sm font-normal ml-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  de {registros.length} total
                </span>
              </h2>
              
              {/* Filtros */}
              <div className="flex space-x-2">
                <select
                  value={filterEmpregado}
                  onChange={(e) => setFilterEmpregado(e.target.value ? Number(e.target.value) : '')}
                  className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300'
                  }`}
                >
                  <option value="">Todos os colaboradores</option>
                  {empregados.map(emp => (
                    <option key={emp.id_empregado} value={emp.id_empregado}>
                      {emp.nome}
                    </option>
                  ))}
                </select>
                
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300'
                  }`}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredRegistros.map(registro => (
                <div key={registro.id_registro} className={`rounded-xl shadow-lg p-6 border hover:shadow-xl transition duration-300 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`font-semibold text-lg ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {getEmpregadoNome(registro.empregado_id_empregado)}
                      </h3>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {new Date(registro.data_registro).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(registro)}
                        className={`p-2 rounded-lg transition duration-200 ${
                          isDark
                            ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900'
                            : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                        }`}
                        title="Editar"
                        disabled={loadingAction}
                      >
                        {loadingAction && editingId === registro.id_registro ? (
                          <div className={`animate-spin rounded-full h-4 w-4 border-b-2 ${
                            isDark ? 'border-blue-400' : 'border-blue-600'
                          }`}></div>
                        ) : (
                          <FiEdit size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(registro.id_registro)}
                        className={`p-2 rounded-lg transition duration-200 ${
                          isDark
                            ? 'text-red-400 hover:text-red-300 hover:bg-red-900'
                            : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                        }`}
                        title="Excluir"
                        disabled={loadingAction}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>