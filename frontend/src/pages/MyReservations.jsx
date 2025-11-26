import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { apiFetch } from '../api/client';

export default function MyReservations() {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  const loadReservations = async () => {
    try {
      const data = await apiFetch('/api/reservas/my/', { token });
      setReservations(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadReservations();
    // eslint-disable-next-line
  }, [token]);

  const cancelReservation = async (id) => {
    try {
      await apiFetch(`/api/reservas/${id}/cancel/`, { method: 'POST', token });
      alert('Reserva cancelada');
      loadReservations(); // recargar lista
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Mis reservas</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {reservations.length === 0 && <div className="alert alert-warning">No tienes reservas activas</div>}
      <ul className="list-group">
        {reservations.map((res) => (
          <li key={res.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{res.event.name}</strong> <br />
              Fecha: {res.event.date} • Hora: {res.event.time} <br />
              Plazas reservadas: {res.seats}
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => cancelReservation(res.id)}>
              Cancelar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
