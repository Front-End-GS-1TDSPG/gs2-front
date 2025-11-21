import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch,
  FaList,
  FaQuestion,
  FaLaptop,
  FaUser,
  FaLock,
  FaBuilding,
  FaChevronDown,
  FaPhone,
  FaSpinner,
  FaTimes
} from 'react-icons/fa';
import { useTheme } from '../../contexts/useTheme';
import type { FAQItem, FAQCategory } from '../../types/tipoFaq';
import { listaCategorias, listaFaq } from '../../data/listaFaq';

export default function FAQ() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredItems, setFilteredItems] = useState<FAQItem[]>([]);

  // Categorias disponíveis
  const categories: FAQCategory[] = listaCategorias;

  // Função para navegar para a rota de cadastro
  const handleEntrarEmContato = () => {
    navigate('/contato');
  };

  // Renderiza ícone baseado no nome
  const renderIcon = (iconName: string, size: string = 'text-base') => {
    const iconProps = { className: size };
    
    switch (iconName) {
      case 'FaList':
        return <FaList {...iconProps} />;
      case 'FaQuestion':
        return <FaQuestion {...iconProps} />;
      case 'FaLaptop':
        return <FaLaptop {...iconProps} />;
      case 'FaUser':
        return <FaUser {...iconProps} />;
      case 'FaLock':
        return <FaLock {...iconProps} />;
      case 'FaBuilding':
        return <FaBuilding {...iconProps} />;
      case 'FaSearch':
        return <FaSearch {...iconProps} />;
      case 'FaChevronDown':
        return <FaChevronDown {...iconProps} />;
      case 'FaPhone':
        return <FaPhone {...iconProps} />;
      case 'FaSpinner':
        return <FaSpinner {...iconProps} />;
      case 'FaTimes':
        return <FaTimes {...iconProps} />;
      default:
        return <FaQuestion {...iconProps} />;
    }
  };

  // Carrega dados do FAQ
  useEffect(() => {
    const loadFAQData = async () => {
      try {
        // Simula delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setFaqItems(listaFaq);
        setFilteredItems(listaFaq);

      } catch (error) {
        console.error('Erro ao carregar dados do FAQ:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFAQData();
  }, []); 

  // Filtra itens baseado na busca e categoria
  useEffect(() => {
    let filtered = faqItems;

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filtro por busca
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term)
      );
    }

    setFilteredItems(filtered);
  }, [searchTerm, selectedCategory, faqItems]);

  const toggleFAQ = (id: number) => {
    setFaqItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  const getCategoryName = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'all': 'Todos',
      'geral': 'Geral',
      'tecnico': 'Técnico',
      'conta': 'Conta',
      'seguranca': 'Segurança',
      'empresa': 'Empresa'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'faq-dark' : 'faq-light'}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Perguntas Frequentes
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Encontre respostas para as dúvidas mais comuns sobre a MentalTech
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className={`rounded-xl shadow-lg p-6 ${isDark ? 'search-filters-dark' : 'search-filters-light'}`}>
            {/* Search Bar */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Buscar por perguntas ou respostas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-3 pl-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 placeholder-gray-500'
                }`}
              />
              <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                isDark ? 'text-gray-400' : 'text-gray-400'
              }`}>
                {renderIcon('FaSearch')}
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(category => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-300 ${
                    selectedCategory === category.name
                      ? 'bg-blue-600 text-white'
                      : isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {renderIcon(category.icon)}
                  <span>{getCategoryName(category.name)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            {renderIcon('FaSpinner', `animate-spin h-12 w-12 ${isDark ? 'text-blue-400' : 'text-blue-600'}`)}
            <span className={`ml-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Carregando FAQ...</span>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="text-center mb-6">
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                {filteredItems.length === faqItems.length 
                  ? `Mostrando todas as ${faqItems.length} perguntas`
                  : `Encontradas ${filteredItems.length} de ${faqItems.length} perguntas`
                }
                {selectedCategory !== 'all' && ` na categoria ${getCategoryName(selectedCategory)}`}
              </p>
            </div>

            {/* FAQ Items */}
            <div className="max-w-4xl mx-auto space-y-4 mb-12">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                    isDark ? 'faq-item-dark' : 'faq-item-light'
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(item.id)}
                    className={`w-full px-6 py-4 text-left flex justify-between items-center transition duration-300 ${
                      isDark 
                        ? 'hover:bg-gray-700' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {renderIcon(categories.find(cat => cat.name === item.category)?.icon || 'FaQuestion', 'text-xl')}
                      </span>
                      <span className={`font-semibold text-lg ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.question}
                      </span>
                    </div>
                    {renderIcon('FaChevronDown', `transform transition duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-400'
                    } ${item.isOpen ? 'rotate-180' : 'rotate-0'}`)}
                  </button>
                  
                  {item.isOpen && (
                    <div className="px-6 pb-4 animate-fadeIn">
                      <div className={`pl-12 border-l-2 ${
                        isDark ? 'border-blue-400' : 'border-blue-500'
                      }`}>
                        <p className={`leading-relaxed ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {item.answer}
                        </p>
                        <div className="mt-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                            isDark 
                              ? 'bg-blue-900 text-blue-200' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {getCategoryName(item.category)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                {renderIcon('FaQuestion', `text-6xl mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`)}
                <h3 className={`text-2xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Nenhuma pergunta encontrada
                </h3>
                <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Tente ajustar os termos da busca ou selecione outra categoria.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className={`px-6 py-3 rounded-lg transition duration-300 flex items-center gap-2 mx-auto ${
                    isDark
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {renderIcon('FaTimes')}
                  Limpar Filtros
                </button>
              </div>
            )}
          </>
        )}
        
        {/* Contact CTA */}
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-xl shadow-lg p-8 text-center ${
            isDark 
              ? 'bg-linear-to-r from-blue-700 to-purple-700 text-white' 
              : 'bg-linear-to-r from-blue-600 to-purple-600 text-white'
          }`}>
            <h2 className="text-2xl font-bold mb-4">
              Não encontrou o que procurava?
            </h2>
            <p className={`mb-6 max-w-2xl mx-auto ${
              isDark ? 'text-blue-200' : 'text-blue-100'
            }`}>
              Nossa equipe de suporte está pronta para ajudar você com qualquer dúvida adicional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleEntrarEmContato}
                className={`px-6 py-3 rounded-lg font-semibold transition duration-300 flex items-center gap-2 mx-auto ${
                  isDark
                    ? 'bg-white text-blue-700 hover:bg-gray-100'
                    : 'bg-white text-blue-600 hover:bg-gray-100'
                }`}
              >
                {renderIcon('FaPhone')}
                Entrar em Contato
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}