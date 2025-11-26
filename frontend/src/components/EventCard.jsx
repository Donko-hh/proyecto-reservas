import { useState } from 'react';

export default function EventCard({ event, onReserve }) {
  const { name, date, time, capacity, description, available_seats, reserved_seats } = event;
  const [seats, setSeats] = useState(1);

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">{description}</p>
        <p className="card-text">
          <small className="text-muted">
            Fecha: {date} • Hora: {time}
          </small>
        </p>
        <p className="card-text">
          <small className="text-muted">
            Capacidad total: {capacity} • Reservados: {reserved_seats} • Disponibles: {available_seats}
          </small>
        </p>

        {onReserve && (
          available_seats > 0 ? (
            <div className="d-flex gap-2">
              <input
                type="number"
                min="1"
                max={available_seats}
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="form-control w-25"
              />
              <button
                className="btn btn-primary"
                onClick={() => onReserve(event, seats)}
              >
                Reservar
              </button>
            </div>
          ) : (
            <p className="text-danger">No quedan cupos disponibles</p>
          )
        )}
      </div>
    </div>
  );
}
