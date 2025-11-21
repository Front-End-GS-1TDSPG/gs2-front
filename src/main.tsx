import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "tailwindcss"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './routes/Home/index.tsx'
import Error from './routes/Error/index.tsx'
import Sobre from './routes/Sobre/index.tsx'
import Integrantes from './routes/Integrantes/index.tsx'
import FAQ from './routes/FAQ/index.tsx'
import Contato from './routes/Contato/index.tsx'
import Login from './routes/Login/index.tsx'
import Cadastro from './routes/Cadastro/index.tsx'
import Dashboard from './routes/Dashboard/index.tsx'
import RegistroHumor from './routes/RegistroHumor/index.tsx'

const router = createBrowserRouter([
  {path: "/", element: <App/>, errorElement: <Error/>, children:[
  {path:"/", element:<Home/>},
  {path:"/sobre", element:<Sobre/>},
  {path:"/integrantes", element:<Integrantes/>},
  {path:"/faq", element:<FAQ/>},
  {path:"/contato", element:<Contato/>},
  {path:"/login", element:<Login/>},
  {path:"/cadastro", element:<Cadastro/>},
  {path:"/registro-humor", element:<RegistroHumor/>},
  {path:"/dashboard", element:<Dashboard/>},
  ]}
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
