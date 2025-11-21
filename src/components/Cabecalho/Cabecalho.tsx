import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FaHome,
  FaChartBar,
  FaSmile,
  FaEdit,
  FaInfoCircle,
  FaUsers,
  FaQuestionCircle,
  FaEnvelope,
  FaSignInAlt,
  FaSignOutAlt,
  FaRocket,
  FaUser,
  FaBars,
  FaTimes,
  FaMoon,
  FaSun
} from "react-icons/fa";
import type { TipoUserData } from "../../types/tipoUserData";
import { useTheme } from "../../contexts/useTheme";

export default function Cabecalho() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  
  // Inicializar userData diretamente do localStorage
  const [userData, setUserData] = useState<TipoUserData | null>(() => {
    const savedUserData = localStorage.getItem("userData");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (savedUserData && isLoggedIn === "true") {
      return JSON.parse(savedUserData);
    }
    return null;
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Detecta scroll para adicionar sombra
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);