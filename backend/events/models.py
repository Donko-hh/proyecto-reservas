from django.db import models

class Event(models.Model):
    name = models.CharField(max_length=120)
    date = models.DateField()
    time = models.TimeField()
    duration_minutes = models.PositiveIntegerField()
    capacity = models.PositiveIntegerField()
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def title(self):
        return f'{self.name} ({self.date} {self.time})'

    def __str__(self):
        return self.title

    @property
    def reserved_seats(self):
        """Cantidad de asientos reservados (solo reservas activas)."""
        try:
            return sum(r.seats for r in self.reservations.filter(status='active'))
        except Exception:
            return 0

    @property
    def available_seats(self):
        """Cupos disponibles calculados dinámicamente."""
        try:
            return self.capacity - self.reserved_seats
        except Exception:
            return 0
