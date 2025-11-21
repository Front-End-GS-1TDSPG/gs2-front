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

                  {/* Níveis */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className={`text-center p-3 rounded-lg border-2 ${getHumorColor(registro.nivel_humor)}`}>
                      <div className="flex justify-center mb-1">{getHumorIcon(registro.nivel_humor)}</div>
                      <div className="font-semibold">Humor</div>
                      <div className="text-lg font-bold">{registro.nivel_humor}/5</div>
                    </div>
                    <div className={`text-center p-3 rounded-lg border-2 ${getEstresseColor(registro.nivel_estresse)}`}>
                      <div className="flex justify-center mb-1">{getEstresseIcon(registro.nivel_estresse)}</div>
                      <div className="font-semibold">Estresse</div>
                      <div className="text-lg font-bold">{registro.nivel_estresse}/5</div>
                    </div>
                  </div>

                  {/* Observação */}
                  <div className={`border-t pt-4 ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <p className={`text-sm mb-2 flex items-center ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <FiFileText className="mr-1" />
                      <strong>Observações:</strong>
                    </p>
                    <p className={`p-3 rounded-lg border ${
                      isDark 
                        ? 'text-gray-300 bg-gray-700 border-gray-600' 
                        : 'text-gray-600 bg-gray-50 border-gray-200'
                    }`}>
                      {registro.observacao || 'Nenhuma observação fornecida'}
                    </p>
                    {registro.observacao && (
                      <div className={`mt-2 text-xs text-right ${
                        isDark ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {registro.observacao.length} caracteres
                      </div>
                    )}
                  </div>

                  {/* Modal de Confirmação de Exclusão */}
                  {deleteConfirm === registro.id_registro && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                      <div className={`rounded-xl p-6 max-w-md w-full ${
                        isDark ? 'modal-dark' : 'modal-light'
                      }`}>
                        <h3 className={`text-lg font-bold mb-4 flex items-center ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          <FiAlertTriangle className={`mr-2 ${
                            isDark ? 'text-red-400' : 'text-red-600'
                          }`} />
                          Confirmar Exclusão
                        </h3>
                        <p className={`mb-6 ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Tem certeza que deseja excluir o registro de humor de <strong>{getEmpregadoNome(registro.empregado_id_empregado)}</strong> do dia <strong>{new Date(registro.data_registro).toLocaleDateString('pt-BR')}</strong>? Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className={`px-4 py-2 transition duration-200 disabled:opacity-50 flex items-center ${
                              isDark
                                ? 'text-gray-400 hover:text-white'
                                : 'text-gray-600 hover:text-gray-800'
                            }`}
                            disabled={loadingAction}
                          >
                            <FiX className="mr-1" />
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleDelete(registro.id_registro)}
                            className={`px-4 py-2 rounded-lg transition duration-200 disabled:opacity-50 flex items-center ${
                              isDark
                                ? 'bg-red-700 text-white hover:bg-red-600'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                            disabled={loadingAction}
                          >
                            {loadingAction ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Excluindo...
                              </div>
                            ) : (
                              <>
                                <FiTrash2 className="mr-1" />
                                Excluir
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {filteredRegistros.length === 0 && (
                <div className={`rounded-xl shadow-lg p-8 text-center ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className="flex justify-center mb-4">
                    <MdSentimentNeutral className={`text-6xl ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {registros.length === 0 ? 'Nenhum registro encontrado' : 'Nenhum registro com os filtros aplicados'}
                  </h3>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    {registros.length === 0 
                      ? 'Comece criando o primeiro registro de humor!' 
                      : 'Tente alterar os filtros para ver mais registros.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Formulário */}
          <div id="form-section">
            <div className={`rounded-xl shadow-lg p-6 sticky top-6 ${
              isDark ? 'form-container-dark' : 'form-container-light'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 flex items-center ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {editingId ? (
                  <>
                    <FiEdit className="mr-2" />
                    Editar Registro
                  </>
                ) : (
                  <>
                    <FiPlus className="mr-2" />
                    Novo Registro
                  </>
                )}
              </h2>

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
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione um colaborador</option>
                    {empregados.map(emp => (
                      <option key={emp.id_empregado} value={emp.id_empregado}>
                        {emp.nome} - {emp.tipo_colaborador}
                      </option>
                    ))}
                  </select>
                  {errors.empregado_id_empregado && (
                    <p className="text-red-500 text-sm mt-1">{errors.empregado_id_empregado.message}</p>
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
                    <MdSentimentVeryDissatisfied className={isDark ? 'text-gray-400' : 'text-gray-600'} />
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
                    <MdSentimentVerySatisfied className={isDark ? 'text-gray-400' : 'text-gray-600'} />
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
                    <IoHappy className={isDark ? 'text-gray-400' : 'text-gray-600'} />
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
                    <MdSick className={isDark ? 'text-gray-400' : 'text-gray-600'} />
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

                {/* Botões de Ação */}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loadingAction}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition duration-300 flex items-center justify-center ${
                      loadingAction
                        ? 'bg-gray-500 cursor-not-allowed'
                        : isDark
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loadingAction ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {editingId ? 'Atualizando...' : 'Criando...'}
                      </div>
                    ) : editingId ? (
                      <>
                        <FiSave className="mr-2" />
                        Atualizar Registro
                      </>
                    ) : (
                      <>
                        <FiPlus className="mr-2" />
                        Criar Registro
                      </>
                    )}
                  </button>
                  
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className={`py-3 px-6 rounded-lg font-semibold transition duration-300 disabled:opacity-50 flex items-center ${
                        isDark
                          ? 'bg-gray-600 text-white hover:bg-gray-500'
                          : 'bg-gray-500 text-white hover:bg-gray-600'
                      }`}
                      disabled={loadingAction}
                    >
                      <FiX className="mr-2" />
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Botão de recarregar */}
        <div className="mt-8 text-center">
          <button
            onClick={loadData}
            disabled={loading}
            className={`px-6 py-2 rounded-lg transition duration-300 flex items-center mx-auto disabled:opacity-50 ${
              isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Atualizando...' : 'Atualizar Dados'}
          </button>
        </div>

        {/* Botão para voltar ao topo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition duration-300 ${
            isDark
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <FiArrowUp size={20} />
        </button>
      </div>
    </div>
  );
}