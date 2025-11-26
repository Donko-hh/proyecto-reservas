import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { apiFetch } from '../api/client';
import EventCard from '../components/EventCard';

export default function Events() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState(null);

  // Cargar eventos activos
  const loadEvents = async () => {
    try {
      const qs = new URLSearchParams();
      if (search) qs.set('search', search);
      if (date) qs.set('date', date);
      const data = await apiFetch(`/api/eventos/activos/${qs.toString() ? `?${qs}` : ''}`, {
        token,
      });
      setEvents(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line
  }, [search, date, token]);

  // Reservar directamente con cantidad
  const handleReserve = async (event, seats) => {
    try {
      await apiFetch('/api/reservas/', {
        method: 'POST',
        token,
        body: { event: event.id, seats: seats }
      });
      alert('Reserva creada con éxito');
      loadEvents(); // refrescar cupos
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Eventos activos</h3>

      {/* Filtros */}
      <div className="row mb-3 g-2">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Buscar por nombre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* Errores */}
      {error && <div className="alert alert-danger">{error}</div>}
      {events.length === 0 && <div className="alert alert-warning">No hay eventos disponibles</div>}

      {/* Tarjetas */}
      {events.map((ev) => (
        <EventCard key={ev.id} event={ev} onReserve={handleReserve} />
      ))}
    </div>
  );
}
