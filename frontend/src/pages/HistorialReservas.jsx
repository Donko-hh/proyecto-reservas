import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { apiFetch } from '../api/client';

export default function HistorialReservas() {
  const { token, role } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/reservas/history/', { token })
      .then((data) => {
        const lista = Array.isArray(data) ? data : data.results || [];
        setReservas(lista);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Historial de Reservas</h3>

      {loading && <div className="text-center">Cargando historial...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && reservas.length === 0 && !error && (
        <div className="alert alert-info text-center">Sin historial disponible</div>
      )}

      {!loading && reservas.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                {role === 'admin' && <th>Usuario</th>}
                <th>Evento</th>
                <th>Cantidad</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  {role === 'admin' && <td>{r.user_username || r.user}</td>}
                  <td>{r.event_name || r.event}</td>
                  <td>{r.quantity || r.seats}</td>
                  <td>{r.created_at?.slice(0, 19).replace('T', ' ')}</td>
                  <td>{r.status === 'cancelled' ? 'Cancelada' : 'Finalizada'}</td>
                  <td>{r.attended ? 'Sí' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
