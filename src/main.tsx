import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "tailwindcss"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './routes/Home/index.tsx'
import Error from './routes/Error/index.tsx'
import Sobre from './routes/Sobre/index.tsx'
import Integrantes from './routes/Integrantes/index.tsx'

const router = createBrowserRouter([
  {path: "/", element: <App/>, errorElement: <Error/>, children:[
  {path:"/", element:<Home/>},
  {path:"/sobre", element:<Sobre/>},
  {path:"/integrantes", element:<Integrantes/>},
  ]}
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
