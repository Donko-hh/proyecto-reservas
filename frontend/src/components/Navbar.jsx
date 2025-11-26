import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Eventos</Link>
        <div id="nav" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/eventos">Activos</NavLink>
            </li>

            {role === 'user' && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/mis-reservas">Mis reservas</NavLink>
              </li>
            )}

            {role === 'admin' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/reservas">Reservas</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/reportes">Reportes</NavLink>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item text-white mt-2 me-3">
                  {user.username ? `Hola, ${user.username}` : `Rol: ${role}`}
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light" onClick={handleLogout}>Salir</button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <NavLink className="btn btn-outline-light" to="/login">Ingresar</NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
