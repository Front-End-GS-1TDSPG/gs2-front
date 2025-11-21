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

  // Simula carregamento de métodos de contato
  useEffect(() => {
    const timer = setTimeout(() => {
      setContactMethods(prev => [...prev]);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Atualiza contador de caracteres
  useEffect(() => {
    setCharCount(formData.mensagem.length);
  }, [formData.mensagem]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpa erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.telefone && !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(formData.telefone)) {
      newErrors.telefone = 'Telefone inválido';
    }

    if (!formData.assunto) {
      newErrors.assunto = 'Assunto é obrigatório';
    }

    if (!formData.mensagem.trim()) {
      newErrors.mensagem = 'Mensagem é obrigatória';
    } else if (formData.mensagem.length < 10) {
      newErrors.mensagem = 'Mensagem deve ter pelo menos 10 caracteres';
    } else if (formData.mensagem.length > 1000) {
      newErrors.mensagem = 'Mensagem deve ter no máximo 1000 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simula envio para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simula sucesso/erro aleatório para demonstração
      const isSuccess = Math.random() > 0.3;
      
      if (isSuccess) {
        setSubmitStatus('success');
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          empresa: '',
          assunto: '',
          mensagem: ''
        });
        setCharCount(0);
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    handleInputChange('telefone', formatted);
  };