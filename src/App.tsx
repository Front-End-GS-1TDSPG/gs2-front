import { Outlet } from "react-router-dom";
import './globals.css'
import Cabecalho from "./components/Cabecalho/Cabecalho";
import Rodape from "./components/Rodape/Rodape";
import { ThemeProvider } from "./contexts/ThemeContext";

export default function App(){
  return(
    <ThemeProvider>
      <div className="light-mode">
        <Cabecalho/>
        <Outlet/>
        <Rodape/>
      </div>
    </ThemeProvider>
  )
}