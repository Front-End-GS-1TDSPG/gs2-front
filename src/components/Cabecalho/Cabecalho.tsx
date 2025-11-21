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

    return (
    <header className={`header-base ${isScrolled ? 'header-scrolled' : 'header-default'} ${
      isDark ? 'dark-header' : 'light-header'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavigation('/')}
          >
            <div className="logo-container">
              <span className="logo-text">M</span>
            </div>
            <div className="flex flex-col">
              <span className="logo-title">
                MentalTech
              </span>
            </div>
          </div>

          {/* Saudação do usuário logado - Desktop */}
          {userData && (
            <div className="hidden lg:flex items-center space-x-4 mr-4">
              <div className="user-greeting">
                <FaUser className="user-icon" />
                Olá, <strong className="user-name">{userData.nome.split(' ')[0]}</strong>!
              </div>
            </div>
          )}

          {/* Menu Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            <ul className="flex items-center space-x-1">
              {menuItems.map((item) => (
                item.hide ? null : (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavigation(item.path, item.onClick)}
                      className={`
                        menu-item-base
                        ${isActiveRoute(item.path)
                          ? 'menu-item-active'
                          : item.label === 'Sair'
                          ? 'menu-item-logout'
                          : item.label === 'Login'
                          ? 'menu-item-login'
                          : item.label === 'Cadastro'
                          ? 'menu-item-cadastro'
                          : 'menu-item-inactive'
                        }
                      `}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  </li>
                )
              ))}
            </ul>
            
            {/* Botão de alternância de tema - Desktop */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-desktop"
              aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
            >
              {isDark ? (
                <FaSun className="theme-icon-sun" />
              ) : (
                <FaMoon className="theme-icon-moon" />
              )}
            </button>
          </nav>

          {/* Menu Mobile Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMenu}
            aria-label="Abrir menu"
          >
            {isMenuOpen ? (
              <FaTimes className="menu-toggle-icon" />
            ) : (
              <FaBars className="menu-toggle-icon" />
            )}
          </button>
        </div>

        {/* Menu Mobile */}
        <div className={`lg:hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <nav className="mobile-menu-nav">
            {/* Saudação do usuário logado - Mobile */}
            {userData && (
              <div className="mobile-user-greeting">
                <FaUser className="mobile-user-icon" />
                <div className="mobile-user-text">
                  Olá, <strong className="mobile-user-name">{userData.nome.split(' ')[0]}</strong>!
                </div>
              </div>
            )}
            
            <ul className="mobile-menu-list max-h-[70vh] overflow-y-auto">
              {menuItems.map((item) => (
                item.hide ? null : (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavigation(item.path, item.onClick)}
                      className={`
                        mobile-menu-item-base
                        ${isActiveRoute(item.path)
                          ? 'mobile-menu-item-active'
                          : item.label === 'Sair'
                          ? 'mobile-menu-item-logout'
                          : item.label === 'Login'
                          ? 'mobile-menu-item-login'
                          : item.label === 'Cadastro'
                          ? 'mobile-menu-item-cadastro'
                          : 'mobile-menu-item-inactive'
                        }
                      `}
                    >
                      {item.icon}
                      <span className="mobile-menu-label">{item.label}</span>
                    </button>
                  </li>
                )
              ))}
              
              {/* Botão de alternância de tema - Mobile */}
              <li>
                <button
                  onClick={toggleTheme}
                  className="theme-toggle-mobile"
                >
                  {isDark ? (
                    <FaSun className="theme-icon-sun" />
                  ) : (
                    <FaMoon className="theme-icon-moon" />
                  )}
                  <span className="mobile-menu-label">
                    {isDark ? "Modo Claro" : "Modo Escuro"}
                  </span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}