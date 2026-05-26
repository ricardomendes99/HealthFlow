import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import AppLayout from './pages/app/AppLayout'
import ClientsPage from './pages/app/ClientsPage'
import ServicesPage from './pages/app/ServicesPage'
import QuestionnairesPage from './pages/app/QuestionnairesPage'
import ResponsesPage from './pages/app/ResponsesPage'
import RemindersPage from './pages/app/RemindersPage'
import ClientAreaPage from './pages/app/ClientAreaPage'
import TutorialsPage from './pages/app/TutorialsPage'
import SupportPage from './pages/app/SupportPage'
import ReferralPage from './pages/app/ReferralPage'
import PatientPage from './pages/patient/PatientPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return !isAuthenticated ? <>{children}</> : <Navigate to="/app/clientes" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/cadastro" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/app" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
        <Route index element={<Navigate to="/app/clientes" replace />} />
        <Route path="clientes" element={<ClientsPage />} />
        <Route path="servicos" element={<ServicesPage />} />
        <Route path="questionarios" element={<QuestionnairesPage />} />
        <Route path="respostas" element={<ResponsesPage />} />
        <Route path="lembretes" element={<RemindersPage />} />
        <Route path="area-cliente" element={<ClientAreaPage />} />
        <Route path="tutoriais" element={<TutorialsPage />} />
        <Route path="suporte" element={<SupportPage />} />
        <Route path="indique" element={<ReferralPage />} />
      </Route>
      <Route path="/p/:slug" element={<PatientPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
