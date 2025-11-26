from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from .models import Reservation

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'seats', 'status', 'attended', 'created_at', 'acciones')
    list_filter = ('status', 'attended')
    search_fields = ('user__username', 'event__name')
    ordering = ('-created_at',)

    def acciones(self, obj):
        edit_url = reverse('admin:reservations_reservation_change', args=[obj.id])
        delete_url = reverse('admin:reservations_reservation_delete', args=[obj.id])
        return format_html(
            '<a class="button" href="{}">Editar</a> '
            '<a class="button" href="{}">Eliminar</a>',
            edit_url,
            delete_url
        )
    acciones.short_description = 'Acciones'
