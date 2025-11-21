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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setUserData(null);
    setIsMenuOpen(false);
    window.location.reload();
  };

  const menuItems = [
    { path: "/", label: "Início", icon: <FaHome className="text-base" /> },
    { path: "/dashboard", label: "Dashboard", icon: <FaChartBar className="text-base" /> },
    { path: "/registro-humor", label: "Registrar Humor", icon: <FaSmile className="text-base" /> },
    { path: "/gerenciar-humor", label: "Gerenciar Humor", icon: <FaEdit className="text-base" /> },
    { path: "/sobre", label: "Sobre", icon: <FaInfoCircle className="text-base" /> },
    { path: "/integrantes", label: "Integrantes", icon: <FaUsers className="text-base" /> },
    { path: "/faq", label: "FAQ", icon: <FaQuestionCircle className="text-base" /> },
    { path: "/contato", label: "Contato", icon: <FaEnvelope className="text-base" /> },
    { 
      path: "/login", 
      label: userData ? "Sair" : "Login", 
      icon: userData ? <FaSignOutAlt className="text-base" /> : <FaSignInAlt className="text-base" />,
      onClick: userData ? handleLogout : undefined
    },
    { 
      path: "/cadastro", 
      label: "Cadastro", 
      icon: <FaRocket className="text-base" />,
      hide: !!userData // Esconder cadastro se usuário estiver logado
    },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string, onClick?: () => void) => {
    if (onClick) {
      onClick();
    } else {
      navigate(path);
      setIsMenuOpen(false);
    }
  };