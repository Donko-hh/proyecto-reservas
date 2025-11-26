import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { apiFetch } from '../api/client';

export default function Reports() {
  const { token } = useAuth();
  const [occupancy, setOccupancy] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const load = async () => {
    try {
      const qs = new URLSearchParams();
      if (from) qs.set('from', from);
      if (to) qs.set('to', to);

      const occ = await apiFetch(`/api/reportes/ocupacion/${qs.toString() ? `?${qs}` : ''}`, { token });
      const att = await apiFetch(`/api/reportes/asistencia/${qs.toString() ? `?${qs}` : ''}`, { token });

      setOccupancy(occ.results || occ || []);
      setAttendance(att.results || att || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Reportes</h3>

      {/* Filtros */}
      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input type="date" className="form-control" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="col-md-4">
          <input type="date" className="form-control" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary w-100" onClick={load}>Filtrar</button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {/* Ocupación */}
        <div className="col-md-6">
          <h5>Ocupación</h5>
          <ul className="list-group">
            {(occupancy || []).length === 0 && (
              <li className="list-group-item text-center">Sin datos de ocupación</li>
            )}
            {(occupancy || []).map((o, idx) => {
              const capacity = o.capacity || 0;
              const reserved = o.reserved || 0;
              const percentage = capacity > 0 ? Math.round((reserved / capacity) * 100) : 0;
              return (
                <li key={idx} className="list-group-item d-flex justify-content-between">
                  <span>{o.event_name || o.name}</span>
                  <span>{reserved}/{capacity} ({percentage}%)</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Asistencia */}
        <div className="col-md-6">
          <h5>Asistencia</h5>
          <ul className="list-group">
            {(attendance || []).length === 0 && (
              <li className="list-group-item text-center">Sin datos de asistencia</li>
            )}
            {(attendance || []).map((a, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between">
                <span>{a.event_name || a.name}</span>
                <span>{a.attended} asistencias</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
