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