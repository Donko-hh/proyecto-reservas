from django.db import models
from django.conf import settings
from events.models import Event

class Reservation(models.Model):
    STATUS_CHOICES = (
        ('active', 'Activa'),
        ('cancelled', 'Cancelada'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reservations'
    )
    event = models.ForeignKey(
        Event,
        on_delete=models.PROTECT,
        related_name='reservations'
    )
    seats = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    attended = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'event'],
                condition=models.Q(status='active'),
                name='unique_active_reservation'
            )
        ]

    def __str__(self):
        return f'{self.user.username} -> {self.event.name} ({self.seats})'

    def cancel(self):
        """Marca la reserva como cancelada sin romper la BD."""
        if self.status != 'cancelled':
            self.status = 'cancelled'
            self.save()
