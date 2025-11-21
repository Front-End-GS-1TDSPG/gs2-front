import { useTheme } from "../../contexts/useTheme";

export default function Rodape() {
  const { isDark } = useTheme();

  return (
    <footer className={`footer-base ${isDark ? 'footer-dark' : 'footer-light'}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="footer-title">MentalTech</h3>
            <p className={`footer-text ${isDark ? 'footer-text-dark' : 'footer-text-light'}`}>
              Sistema de Monitoramento de Bem-Estar e Saúde Mental no Trabalho
            </p>
          </div>
          
          <div>
            <h4 className="footer-subtitle">Links Rápidos</h4>
            <ul className={`footer-list ${isDark ? 'footer-list-dark' : 'footer-list-light'}`}>
              <li><a href="/" className="footer-link">Início</a></li>
              <li><a href="/sobre" className="footer-link">Sobre</a></li>
              <li><a href="/faq" className="footer-link">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="footer-subtitle">Contato</h4>
            <ul className={`footer-list ${isDark ? 'footer-list-dark' : 'footer-list-light'}`}>
              <li>Email: contato@mentaltech.com</li>
              <li>Telefone: (11) 3772-3828</li>
            </ul>
          </div>
          
          <div>
            <h4 className="footer-subtitle">Grupo AGJ</h4>
            <p className={`footer-text ${isDark ? 'footer-text-dark' : 'footer-text-light'}`}>
              Projeto desenvolvido para a Global Solution
            </p>
          </div>
        </div>
        
        <div className={`footer-bottom ${isDark ? 'footer-bottom-dark' : 'footer-bottom-light'}`}>
          <p>&copy; 2025 Grupo AGJ - MentalTech. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}