import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
  FaCheck, 
  FaTimes, 
  FaExclamationTriangle, 
  FaInfoCircle,
  FaEye,
  FaEyeSlash,
  FaRocket,
  FaSpinner,
  FaBuilding,
  FaChartLine,
  FaBell,
  FaFileAlt,
  FaHeadset,
  FaArrowRight
} from 'react-icons/fa';
import type { TipoCadastro } from '../../types/tipoCadastro';
import type { TipoUserData } from '../../types/tipoUserData';
import { useTheme } from '../../contexts/useTheme';

// Componente Modal de Mensagem (mesmo do Login)
interface MessageModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ 
  isOpen, 
  title, 
  message, 
  type, 
  onClose 
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheck className="text-2xl text-green-600" />;
      case 'error':
        return <FaTimes className="text-2xl text-red-600" />;
      case 'warning':
        return <FaExclamationTriangle className="text-2xl text-yellow-600" />;
      case 'info':
        return <FaInfoCircle className="text-2xl text-blue-600" />;
      default:
        return <FaInfoCircle className="text-2xl text-blue-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return isDark ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200';
      case 'error':
        return isDark ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200';
      case 'warning':
        return isDark ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200';
      case 'info':
        return isDark ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200';
      default:
        return isDark ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return isDark ? 'text-green-100' : 'text-green-800';
      case 'error':
        return isDark ? 'text-red-100' : 'text-red-800';
      case 'warning':
        return isDark ? 'text-yellow-100' : 'text-yellow-800';
      case 'info':
        return isDark ? 'text-blue-100' : 'text-blue-800';
      default:
        return isDark ? 'text-blue-100' : 'text-blue-800';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 hover:bg-green-600';
      case 'error':
        return 'bg-red-500 hover:bg-red-600';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'info':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-lg shadow-xl w-full max-w-md border-2 ${getBackgroundColor()}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {getIcon()}
            <h2 className={`text-xl font-bold ${getTextColor()}`}>{title}</h2>
          </div>
          <p className={`${getTextColor()} mb-6`}>{message}</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className={`${getButtonColor()} text-white py-2 px-6 rounded-lg font-semibold transition-colors flex items-center gap-2`}
            >
              <FaCheck className="text-sm" />
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Cadastro() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    setError, 
    setFocus,
    getValues 
  } = useForm<TipoCadastro>();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    senha: '',
    termos: false
  });

  // Atualizar formData quando os campos mudarem
  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    setFocus('nome');
  }, [setFocus]);

  // Estados para os modals
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ 
    title: '', 
    message: '', 
    type: 'info' as 'success' | 'error' | 'warning' | 'info' 
  });

  const showMessage = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setModalMessage({ title, message, type });
    setShowModal(true);
  };

  const onSubmit = async (data: TipoCadastro) => {
    try {
      // Verificar se email já está cadastrado
      const savedUserData = localStorage.getItem('userData');
      if (savedUserData) {
        const existingUser: TipoUserData = JSON.parse(savedUserData);
        if (existingUser.email === data.email) {
          setError('email', { type: 'manual', message: 'Este email já está cadastrado' });
          showMessage(
            "Email em Uso", 
            "Este email já está cadastrado em nosso sistema. Por favor, use outro email ou faça login.", 
            'error'
          );
          return;
        }
      }

      // Simula processamento do cadastro
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Salvar dados do usuário no localStorage
      const userData: TipoUserData = {
        nome: data.nome,
        email: data.email,
        empresa: data.empresa,
        cargo: data.cargo
      };

      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Mostrar modal de sucesso
      showMessage(
        "Cadastro Realizado!", 
        "Seu cadastro foi realizado com sucesso! Redirecionando para a página de login...", 
        'success'
      );
      
      // Redirecionar para login após fechar o modal
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            cadastroSuceso: true,
            email: data.email
          } 
        });
      }, 2000);
      
    } catch {
      showMessage(
        "Erro no Cadastro", 
        "Houve um erro ao processar seu cadastro. Por favor, tente novamente.", 
        'error'
      );
    }
  };

  // Função de validação personalizada para confirmarSenha
  const validateConfirmPassword = (value: string) => {
    const senha = getValues('senha');
    return value === senha || 'As senhas não coincidem';
  };

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'cadastro-dark' : 'cadastro-light'}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="logo-icon">
                <span className="logo-icon-text">W</span>
              </div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>MentalTech</h1>
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Criar sua Conta
            </h2>
            <p className={`max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Junte-se a empresas que já estão transformando o bem-estar de seus colaboradores
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Benefits */}
            <div className={`rounded-2xl shadow-xl p-6 ${isDark ? 'benefits-dark' : 'benefits-light'}`}>
              <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Vantagens da MentalTech</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FaChartLine className={`text-lg mt-1 shrink-0 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <div>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Monitoramento em Tempo Real</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Acompanhe o bem-estar da sua equipe instantaneamente</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FaBell className={`text-lg mt-1 shrink-0 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <div>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Alertas Inteligentes</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Receba notificações proativas sobre a saúde mental</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FaFileAlt className={`text-lg mt-1 shrink-0 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <div>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Relatórios Detalhados</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Analytics completos sobre o clima organizacional</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FaHeadset className={`text-lg mt-1 shrink-0 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <div>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Suporte Dedicado</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Equipe especializada para ajudar sua empresa</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className={`text-center p-4 rounded-lg ${isDark ? 'stat-dark' : 'stat-light-blue'}`}>
                  <FaBuilding className={`text-xl mx-auto mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div className={`text-xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>45+</div>
                  <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Empresas</div>
                </div>
                <div className={`text-center p-4 rounded-lg ${isDark ? 'stat-dark' : 'stat-light-green'}`}>
                  <FaCheck className={`text-xl mx-auto mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <div className={`text-xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>98%</div>
                  <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Satisfação</div>
                </div>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className={`rounded-2xl shadow-xl p-6 ${isDark ? 'form-dark' : 'form-light'}`}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Nome */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    {...register('nome', {
                      required: 'Nome é obrigatório',
                      minLength: {
                        value: 2,
                        message: 'Nome deve ter pelo menos 2 caracteres'
                      }
                    })}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
                      errors.nome ? 'border-red-500' : isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'
                    }`}
                    placeholder="Seu nome completo"
                  />
                  {errors.nome && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FaTimes className="text-xs" />
                      {errors.nome.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'Email inválido'
                      }
                    })}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
                      errors.email ? 'border-red-500' : isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'
                    }`}
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FaTimes className="text-xs" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                 {/* Empresa e Cargo */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Empresa
                    </label>
                    <input
                      type="text"
                      {...register('empresa')}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
                        isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'
                      }`}
                      placeholder="Sua empresa"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Cargo
                    </label>
                    <select
                      {...register('cargo')}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
                        isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecione seu cargo</option>
                      <option value="rh">Recursos Humanos</option>
                      <option value="gestor">Gestor/Líder</option>
                      <option value="ceo">CEO/Diretor</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>

                {/* Senha */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('senha', {
                        required: 'Senha é obrigatória',
                        minLength: {
                          value: 6,
                          message: 'Senha deve ter pelo menos 6 caracteres'
                        },
                        onChange: (e) => handleInputChange('senha', e.target.value)
                      })}
                      className={`w-full px-3 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
                        errors.senha ? 'border-red-500' : isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'
                      }`}
                      placeholder="Crie uma senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                    </button>
                  </div>
                  {errors.senha && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FaTimes className="text-xs" />
                      {errors.senha.message}
                    </p>
                  )}
                </div>

                {/* Confirmar Senha */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Confirmar Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmarSenha', {
                        required: 'Confirme sua senha',
                        validate: validateConfirmPassword
                      })}
                      className={`w-full px-3 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
                        errors.confirmarSenha ? 'border-red-500' : isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'
                      }`}
                      placeholder="Confirme sua senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                    </button>
                  </div>
                  {errors.confirmarSenha && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FaTimes className="text-xs" />
                      {errors.confirmarSenha.message}
                    </p>
                  )}
                </div>

                {/* Termos */}
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    {...register('termos', {
                      required: 'Você deve aceitar os termos'
                    })}
                    onChange={(e) => handleInputChange('termos', e.target.checked)}
                    className={`w-4 h-4 mt-1 rounded focus:ring-blue-500 ${
                      isDark ? 'text-blue-500 bg-gray-700 border-gray-600' : 'text-blue-600'
                    }`}
                  />
                  <label className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Concordo com os{' '}
                    <a href="/termos" className={`hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600 hover:text-blue-800'}`}>
                      Termos de Uso
                    </a>{' '}
                    e{' '}
                    <a href="/privacidade" className={`hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600 hover:text-blue-800'}`}>
                      Política de Privacidade
                    </a>
                  </label>
                </div>
                {errors.termos && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FaTimes className="text-xs" />
                    {errors.termos.message}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.termos}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition duration-300 mt-4 flex items-center justify-center gap-2 ${
                    isSubmitting || !formData.termos
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    <>
                      <FaRocket />
                      Criar Minha Conta
                    </>
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center">
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Já tem uma conta?{' '}
                    <button 
                      type="button"
                      onClick={() => navigate('/login')}
                      className={`font-semibold flex items-center gap-1 mx-auto ${
                        isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      Fazer Login
                      <FaArrowRight className="text-xs" />
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Mensagem */}
      <MessageModal
        isOpen={showModal}
        title={modalMessage.title}
        message={modalMessage.message}
        type={modalMessage.type}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}