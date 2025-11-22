import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaInfoCircle,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaSpinner,
  FaUser,
  FaBuilding,
  FaSmile,
  FaArrowRight
} from 'react-icons/fa';
import type { TipoLogin } from '../../types/tipoLogin';
import type { TipoUserData } from '../../types/tipoUserData';
import { useTheme } from '../../contexts/useTheme';

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

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const { register, handleSubmit, formState: { errors }, setError, setValue } = useForm<TipoLogin>();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ 
    title: '', 
    message: '', 
    type: 'info' as 'success' | 'error' | 'warning' | 'info' 
  });

  useEffect(() => {
    if (location.state?.cadastroSucesso) {
      setModalMessage({
        title: "Cadastro Realizado!",
        message: "Seu cadastro foi realizado com sucesso! Agora faça login com suas credenciais.",
        type: 'success'
      });
      setShowModal(true);
      
      if (location.state.email) {
        setValue('email', location.state.email);
      }
    }
  }, [location.state, setValue]);

  const showMessage = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setModalMessage({ title, message, type });
    setShowModal(true);
  };

  const onSubmit = async (data: TipoLogin) => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const savedUserData = localStorage.getItem('userData');
      
      if (savedUserData) {
        const userData: TipoUserData = JSON.parse(savedUserData);
        
        if (data.email === userData.email) {
          localStorage.setItem('isLoggedIn', 'true');
          
          showMessage(
            "Login Realizado!", 
            `Bem-vindo de volta, ${userData.nome.split(' ')[0]}! Redirecionando para a página inicial...`, 
            'success'
          );
          
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
          return;
        }
      }

      if (data.email === 'demo@mentaltech.com' && data.senha === '123456') {
        const mockUserData: TipoUserData = {
          nome: 'Usuário Demonstração',
          email: data.email,
          empresa: 'Empresa ABC',
          cargo: 'Gestor'
        };
        localStorage.setItem('userData', JSON.stringify(mockUserData));
        localStorage.setItem('isLoggedIn', 'true');
        
        showMessage(
          "Login Realizado!", 
          "Login realizado com sucesso! Redirecionando para a página inicial...", 
          'success'
        );
        
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setError('root', {
          type: 'manual',
          message: 'Email ou senha incorretos. Tente novamente.'
        });
      }
    } catch {
      setError('root', {
        type: 'manual',
        message: 'Erro ao fazer login. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [stats, setStats] = useState({
    usuariosAtivos: 0,
    empresasCadastradas: 0,
    satisfacao: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        usuariosAtivos: 1250,
        empresasCadastradas: 45,
        satisfacao: 98
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen flex items-center justify-center py-8 ${isDark ? 'login-dark' : 'login-light'}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
              <div className="logo-icon">
                <span className="logo-icon-text">W</span>
              </div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>MentalTech</h1>
            </div>
            
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Bem-vindo de volta
            </h2>
            <p className={`text-xl mb-8 max-w-md ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Acesse sua conta para continuar monitorando o bem-estar da sua equipe.
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-md">
              <div className="text-center">
                <FaUser className={`text-xl mx-auto mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{stats.usuariosAtivos}+</div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Usuários Ativos</div>
              </div>
              <div className="text-center">
                <FaBuilding className={`text-xl mx-auto mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{stats.empresasCadastradas}+</div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Empresas</div>
              </div>
              <div className="text-center">
                <FaSmile className={`text-xl mx-auto mb-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                <div className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{stats.satisfacao}%</div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Satisfação</div>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl shadow-xl p-8 max-w-md mx-auto w-full ${isDark ? 'form-dark' : 'form-light'}`}>
            <div className="text-center mb-8">
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Fazer Login</h3>
              <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Entre com suas credenciais</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
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
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
                    errors.email ? 'border-red-500' : isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'
                  }`}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <FaTimes className="text-xs" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
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
                      }
                    })}
                    className={`w-full px-4 py-3 pr-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
                      errors.senha ? 'border-red-500' : isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'
                    }`}
                    placeholder="Sua senha"
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
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <FaTimes className="text-xs" />
                    {errors.senha.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('lembrar')}
                    className={`w-4 h-4 rounded focus:ring-blue-500 ${
                      isDark ? 'text-blue-500 bg-gray-700 border-gray-600' : 'text-blue-600'
                    }`}
                  />
                  <span className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Lembrar-me</span>
                </label>
                <a 
                  href="/recuperar-senha" 
                  className={`text-sm hover:underline ${
                    isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  Esqueceu a senha?
                </a>
              </div>

              {errors.root && (
                <div className={`rounded-lg p-4 ${
                  isDark ? 'bg-red-900 border border-red-700' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <FaTimes className="text-red-600" />
                    <p className={isDark ? 'text-red-100 text-sm' : 'text-red-800 text-sm'}>
                      {errors.root.message}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition duration-300 flex items-center justify-center gap-2 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <FaLock />
                    Entrar
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${isDark ? 'border-gray-600' : 'border-gray-300'}`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>ou</span>
                </div>
              </div>

              <div className="text-center">
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  Não tem uma conta?{' '}
                  <button 
                    type="button"
                    onClick={() => navigate('/cadastro')}
                    className={`font-semibold flex items-center gap-1 mx-auto ${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    Cadastre-se
                    <FaArrowRight className="text-xs" />
                  </button>
                </p>
              </div>
            </form>

            <div className={`mt-8 p-4 rounded-lg ${isDark ? 'demo-credentials-dark' : 'demo-credentials-light'}`}>
              <h4 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <FaInfoCircle className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                Credenciais de Demonstração:
              </h4>
              <div className={`text-xs space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>Email: demo@mentaltech.com</p>
                <p>Senha: 123456</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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