import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Events from './pages/Events';
import Reservations from './pages/Reservations';   // vista admin
import MyReservations from './pages/MyReservations'; // vista usuario normal
import HistorialReservas from './pages/HistorialReservas'; // nuevo componente
import Reports from './pages/Reports';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Al entrar a "/", redirige al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Eventos activos: accesible para todos los roles */}
          <Route
            path="/eventos"
            element={
              <ProtectedRoute allowRoles={['user', 'admin']}>
                <Events />
              </ProtectedRoute>
            }
          />

          {/* Mis reservas: solo usuarios normales */}
          <Route
            path="/mis-reservas"
            element={
              <ProtectedRoute allowRoles={['user']}>
                <MyReservations />
              </ProtectedRoute>
            }
          />

          {/* Historial de reservas: accesible para user y admin */}
          <Route
            path="/historial"
            element={
              <ProtectedRoute allowRoles={['user', 'admin']}>
                <HistorialReservas />
              </ProtectedRoute>
            }
          />

          {/* Reservas: solo admin */}
          <Route
            path="/reservas"
            element={
              <ProtectedRoute allowRoles={['admin']}>
                <Reservations />
              </ProtectedRoute>
            }
          />

          {/* Reportes: solo admin */}
          <Route
            path="/reportes"
            element={
              <ProtectedRoute allowRoles={['admin']}>
                <Reports />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
