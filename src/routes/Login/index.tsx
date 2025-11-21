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