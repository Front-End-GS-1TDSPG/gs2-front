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

// Componente Modal de Mensagem
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
  
  // Estados para os modals
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ 
    title: '', 
    message: '', 
    type: 'info' as 'success' | 'error' | 'warning' | 'info' 
  });

  // Verificar se veio do cadastro com sucesso
  useEffect(() => {
    if (location.state?.cadastroSucesso) {
      setModalMessage({
        title: "Cadastro Realizado!",
        message: "Seu cadastro foi realizado com sucesso! Agora faça login com suas credenciais.",
        type: 'success'
      });
      setShowModal(true);
      
      // Preencher automaticamente o email
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
      // Simula autenticação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Verificar se os dados correspondem aos do cadastro
      const savedUserData = localStorage.getItem('userData');
      
      if (savedUserData) {
        const userData: TipoUserData = JSON.parse(savedUserData);
        
        if (data.email === userData.email) {
          // Marcar usuário como logado
          localStorage.setItem('isLoggedIn', 'true');
          
          // Mostrar modal de sucesso
          showMessage(
            "Login Realizado!", 
            `Bem-vindo de volta, ${userData.nome.split(' ')[0]}! Redirecionando para a página inicial...`, 
            'success'
          );
          
          // Recarregar a página para atualizar o cabeçalho após fechar o modal
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
          return;
        }
      }

      // Fallback para dados de demonstração
      if (data.email === 'demo@mentaltech.com' && data.senha === '123456') {
        // Criar dados mock para usuário de demonstração
        const mockUserData: TipoUserData = {
          nome: 'Usuário Demonstração',
          email: data.email,
          empresa: 'Empresa ABC',
          cargo: 'Gestor'
        };
        localStorage.setItem('userData', JSON.stringify(mockUserData));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Mostrar modal de sucesso
        showMessage(
          "Login Realizado!", 
          "Login realizado com sucesso! Redirecionando para a página inicial...", 
          'success'
        );
        
        // Recarregar a página para atualizar o cabeçalho após fechar o modal
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