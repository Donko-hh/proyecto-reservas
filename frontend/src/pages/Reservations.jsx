import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { apiFetch } from '../api/client';

export default function Reservations() {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch('/api/reservas/', { token })
      .then((data) => setReservations(Array.isArray(data) ? data : data.results || []))
      .catch((err) => setError(err.message));
  }, [token]);

  const markAttendance = (id) =>
    apiFetch(`/api/reservas/${id}/mark_attendance/`, { method: 'POST', token })
      .then(() =>
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, attended: true } : r))
        )
      )
      .catch((err) => alert(`Error al marcar asistencia: ${err.message}`));

  const cancelReservation = (id) =>
    apiFetch(`/api/reservas/${id}/cancel/`, { method: 'POST', token })
      .then(() =>
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
        )
      )
      .catch((err) => alert(`Error al cancelar reserva: ${err.message}`));

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Reservas</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th><th>Usuario</th><th>Evento</th><th>Cantidad</th><th>Fecha</th><th>Asistencia</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.user_username || r.user}</td>
                <td>{r.event_name || r.event}</td>
                <td>{r.quantity}</td>
                <td>{r.created_at?.slice(0, 19).replace('T', ' ')}</td>
                <td>{r.attended ? 'Sí' : 'No'}</td>
                <td className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => markAttendance(r.id)}
                    disabled={r.attended}
                  >
                    Asistió
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => cancelReservation(r.id)}
                    disabled={r.status === 'cancelled'}
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr><td colSpan="7" className="text-center">Sin reservas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
