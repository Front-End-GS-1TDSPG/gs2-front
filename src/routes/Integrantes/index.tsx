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