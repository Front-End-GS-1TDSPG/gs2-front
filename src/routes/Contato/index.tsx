import { useState, useEffect } from 'react';
import { 
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaPaperPlane,
  FaCheck,
  FaTimes,
  FaSpinner
} from 'react-icons/fa';
import { useTheme } from '../../contexts/useTheme';

type FormData = {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  assunto: string;
  mensagem: string;
};

type FormErrors = {
  [key in keyof FormData]?: string;
};

type ContactMethod = {
  id: number;
  tipo: string;
  valor: string;
  icone: string;
  descricao: string;
  cor: string;
};

export default function Contato() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    assunto: '',
    mensagem: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [charCount, setCharCount] = useState(0);

  // Métodos de contato
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>([
    {
      id: 1,
      tipo: 'email',
      valor: 'contato@mentaltech.com',
      icone: 'FaEnvelope',
      descricao: 'Nosso email principal',
      cor: 'blue'
    },
    {
      id: 2,
      tipo: 'telefone',
      valor: '(11) 3772-3828',
      icone: 'FaPhone',
      descricao: 'Horário comercial',
      cor: 'green'
    },
    {
      id: 3,
      tipo: 'whatsapp',
      valor: '(11) 9525-6800',
      icone: 'FaWhatsapp',
      descricao: 'Atendimento rápido',
      cor: 'green'
    },
    {
      id: 4,
      tipo: 'endereco',
      valor: 'Av. Paulista, 1106 - São Paulo/SP',
      icone: 'FaMapMarkerAlt',
      descricao: 'Nossa sede',
      cor: 'red'
    }
  ]);

  // Assuntos disponíveis
  const assuntos = [
    'Dúvida sobre o produto',
    'Solicitar demonstração',
    'Suporte técnico',
    'Parceria comercial',
    'Trabalhe conosco',
    'Outro'
  ];

  // Renderiza ícone baseado no nome
  const renderIcon = (iconName: string, color: string, size: string = 'text-2xl') => {
    const iconProps = { 
      className: `${size} ${isDark ? `text-${color}-400` : `text-${color}-600`}` 
    };
    
    switch (iconName) {
      case 'FaEnvelope':
        return <FaEnvelope {...iconProps} />;
      case 'FaPhone':
        return <FaPhone {...iconProps} />;
      case 'FaWhatsapp':
        return <FaWhatsapp {...iconProps} />;
      case 'FaMapMarkerAlt':
        return <FaMapMarkerAlt {...iconProps} />;
      case 'FaClock':
        return <FaClock {...iconProps} />;
      case 'FaFacebook':
        return <FaFacebook />;
      case 'FaTwitter':
        return <FaTwitter />;
      case 'FaLinkedin':
        return <FaLinkedin />;
      case 'FaGithub':
        return <FaGithub />;
      case 'FaPaperPlane':
        return <FaPaperPlane />;
      case 'FaCheck':
        return <FaCheck />;
      case 'FaTimes':
        return <FaTimes />;
      case 'FaSpinner':
        return <FaSpinner />;
      default:
        return null;
    }
  };