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

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'contato-dark' : 'contato-light'}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Entre em Contato
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Estamos aqui para ajudar você. Entre em contato conosco e responderemos o mais breve possível.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Informações de Contato */}
          <div className="lg:col-span-1">
            <div className={`rounded-xl shadow-lg p-6 sticky top-6 ${isDark ? 'contact-info-dark' : 'contact-info-light'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Nossos Canais
              </h2>
              
              <div className="space-y-4">
                {contactMethods.map(method => (
                  <div
                    key={method.id}
                    className={`flex items-start space-x-4 p-4 rounded-lg border transition duration-300 ${
                      isDark 
                        ? 'border-gray-700 hover:border-blue-500 bg-gray-800' 
                        : 'border-gray-200 hover:border-blue-500 bg-white'
                    }`}
                  >
                    {renderIcon(method.icone, method.cor)}
                    <div>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {method.valor}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {method.descricao}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Horário de Atendimento */}
              <div className={`mt-8 p-4 rounded-lg ${
                isDark ? 'hours-dark' : 'hours-light'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {renderIcon('FaClock', 'blue', 'text-lg')}
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Horário de Atendimento
                  </h3>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Segunda a Sexta: 8h às 18h<br />
                  Sábado: 9h às 12h
                </p>
              </div>

              {/* Redes Sociais */}
              <div className="mt-6">
                <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Siga-nos
                </h3>
                <div className="flex space-x-4">
                  <button className={`w-10 h-10 rounded-full flex items-center justify-center transition duration-300 ${
                    isDark 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                    <FaFacebook className="text-lg" />
                  </button>
                  <button className={`w-10 h-10 rounded-full flex items-center justify-center transition duration-300 ${
                    isDark 
                      ? 'bg-blue-400 text-white hover:bg-blue-500' 
                      : 'bg-blue-400 text-white hover:bg-blue-500'
                  }`}>
                    <FaTwitter className="text-lg" />
                  </button>
                  <button className={`w-10 h-10 rounded-full flex items-center justify-center transition duration-300 ${
                    isDark 
                      ? 'bg-blue-800 text-white hover:bg-blue-900' 
                      : 'bg-blue-800 text-white hover:bg-blue-900'
                  }`}>
                    <FaLinkedin className="text-lg" />
                  </button>
                  <button className={`w-10 h-10 rounded-full flex items-center justify-center transition duration-300 ${
                    isDark 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  }`}>
                    <FaGithub className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Contato */}
          <div className="lg:col-span-2">
            <div className={`rounded-xl shadow-lg p-6 ${isDark ? 'contact-form-dark' : 'contact-form-light'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Envie sua Mensagem
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome e Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
                        errors.nome 
                          ? 'border-red-500' 
                          : isDark 
                            ? 'border-gray-600 bg-gray-700 text-white' 
                            : 'border-gray-300'
                      }`}
                      placeholder="Seu nome completo"
                    />
                    {errors.nome && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <FaTimes className="text-xs" />
                        {errors.nome}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
                        errors.email 
                          ? 'border-red-500' 
                          : isDark 
                            ? 'border-gray-600 bg-gray-700 text-white' 
                            : 'border-gray-300'
                      }`}
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <FaTimes className="text-xs" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Telefone e Empresa */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
                        errors.telefone 
                          ? 'border-red-500' 
                          : isDark 
                            ? 'border-gray-600 bg-gray-700 text-white' 
                            : 'border-gray-300'
                      }`}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                    {errors.telefone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <FaTimes className="text-xs" />
                        {errors.telefone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={formData.empresa}
                      onChange={(e) => handleInputChange('empresa', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
                        isDark 
                          ? 'border-gray-600 bg-gray-700 text-white' 
                          : 'border-gray-300'
                      }`}
                      placeholder="Sua empresa (opcional)"
                    />
                  </div>
                </div>

                {/* Assunto */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Assunto *
                  </label>
                  <select
                    value={formData.assunto}
                    onChange={(e) => handleInputChange('assunto', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
                      errors.assunto 
                        ? 'border-red-500' 
                        : isDark 
                          ? 'border-gray-600 bg-gray-700 text-white' 
                          : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione um assunto</option>
                    {assuntos.map((assunto, index) => (
                      <option key={index} value={assunto}>
                        {assunto}
                      </option>
                    ))}
                  </select>
                  {errors.assunto && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <FaTimes className="text-xs" />
                      {errors.assunto}
                    </p>
                  )}
                </div>

                {/* Mensagem */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Mensagem *
                  </label>
                  <textarea
                    value={formData.mensagem}
                    onChange={(e) => handleInputChange('mensagem', e.target.value)}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 resize-none ${
                      errors.mensagem 
                        ? 'border-red-500' 
                        : isDark 
                          ? 'border-gray-600 bg-gray-700 text-white' 
                          : 'border-gray-300'
                    }`}
                    placeholder="Descreva sua dúvida, solicitação ou feedback..."
                    maxLength={1000}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      {errors.mensagem && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <FaTimes className="text-xs" />
                          {errors.mensagem}
                        </p>
                      )}
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {charCount}/1000 caracteres
                    </div>
                  </div>
                </div>

                {/* Status do Envio */}
                {submitStatus === 'success' && (
                  <div className={`rounded-lg p-4 ${
                    isDark 
                      ? 'bg-green-900 border border-green-700' 
                      : 'bg-green-50 border border-green-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <FaCheck className={isDark ? 'text-green-400 text-lg' : 'text-green-600 text-lg'} />
                      <p className={isDark ? 'text-green-100' : 'text-green-800'}>
                        Mensagem enviada com sucesso! Entraremos em contato em breve.
                      </p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className={`rounded-lg p-4 ${
                    isDark 
                      ? 'bg-red-900 border border-red-700' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <FaTimes className={isDark ? 'text-red-400 text-lg' : 'text-red-600 text-lg'} />
                      <p className={isDark ? 'text-red-100' : 'text-red-800'}>
                        Erro ao enviar mensagem. Tente novamente ou entre em contato por outro canal.
                      </p>
                    </div>
                  </div>
                )}

                {/* Botão de Envio */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition duration-300 flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="text-lg animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="text-lg" />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}