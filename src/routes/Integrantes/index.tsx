import { useState, useEffect } from 'react';
import { 
  FaSpinner,
  FaGithub,
  FaLinkedin,
  FaTimes,
  FaRocket,
  FaBullseye,
  FaUser,
  FaGraduationCap,
  FaIdCard
} from 'react-icons/fa';
import { listaIntegrantes } from '../../data/listaIntegrantes';
import type { TipoIntegrantes } from '../../types/tipoIntegrantes';
import { useTheme } from '../../contexts/useTheme';

export default function Integrantes() {
  const { isDark } = useTheme();
  const [integrantes, setIntegrantes] = useState<TipoIntegrantes[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIntegrante, setSelectedIntegrante] = useState<TipoIntegrantes | null>(null);

  // Carrega dados dos integrantes
  useEffect(() => {
    const loadIntegrantes = async () => {
      try {
        // Simula delay de API
        await new Promise(resolve => setTimeout(resolve, 800));
        setIntegrantes(listaIntegrantes);
      } catch (error) {
        console.error('Erro ao carregar dados dos integrantes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIntegrantes();
  }, []);

  const handleIntegranteClick = (integrante: TipoIntegrantes) => {
    setSelectedIntegrante(integrante);
  };

  const closeModal = () => {
    setSelectedIntegrante(null);
  };

    return (
    <div className={`min-h-screen py-8 ${isDark ? 'integrantes-dark' : 'integrantes-light'}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Nossa Equipe
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Conheça os talentosos desenvolvedores do Grupo AGJ que tornaram a MentalTech possível
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className={`animate-spin h-12 w-12 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`ml-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Carregando integrantes...</span>
          </div>
        ) : (
          <>
            {/* Integrantes Grid - Igual ao Sobre */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
              {integrantes.map(integrante => (
                <div 
                  key={integrante.id} 
                  className={`p-6 rounded-xl text-center transform hover:scale-105 transition duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500 ${
                    isDark 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-blue-50 hover:bg-blue-100'
                  }`}
                  onClick={() => handleIntegranteClick(integrante)}
                >
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 overflow-hidden ${
                    isDark ? 'bg-blue-700' : 'bg-blue-600'
                  }`}>
                    {integrante.photo ? (
                      <img 
                        src={integrante.photo} 
                        alt={integrante.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-4xl" />
                    )}
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {integrante.name}
                  </h3>
                  <div className={`flex items-center justify-center gap-2 mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <FaIdCard className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                    <strong>RM:</strong> {integrante.rm}
                  </div>
                  <div className={`flex items-center justify-center gap-2 mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <FaGraduationCap className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                    <strong>Turma:</strong> {integrante.turma}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <a 
                      href={integrante.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`transition duration-300 flex items-center gap-1 ${
                        isDark 
                          ? 'text-gray-400 hover:text-white' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaGithub />
                      <span>GitHub</span>
                    </a>
                    <a 
                      href={integrante.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`transition duration-300 flex items-center gap-1 ${
                        isDark 
                          ? 'text-blue-400 hover:text-blue-300' 
                          : 'text-blue-600 hover:text-blue-800'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaLinkedin />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Team Description */}
        <div className={`rounded-xl shadow-lg p-8 max-w-4xl mx-auto ${
          isDark ? 'team-description-dark' : 'team-description-light'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 text-center ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Sobre o Grupo AGJ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FaBullseye className={isDark ? 'text-green-400 text-lg' : 'text-green-600 text-lg'} />
                <h3 className={`font-semibold text-lg ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Nossa Missão</h3>
              </div>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                Desenvolver soluções inovadoras que impactem positivamente a sociedade, 
                combinando tecnologia de ponta com boas práticas de desenvolvimento.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FaRocket className={isDark ? 'text-purple-400 text-lg' : 'text-purple-600 text-lg'} />
                <h3 className={`font-semibold text-lg ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Tecnologias</h3>
              </div>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                Especializados em React, TypeScript, Java, Quarkus e outras tecnologias 
                modernas para criar aplicações robustas e escaláveis.
              </p>
            </div>
          </div>
        </div>
      </div>