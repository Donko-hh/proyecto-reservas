from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'time', 'capacity', 'is_active', 'acciones')
    list_filter = ('is_active', 'date')
    search_fields = ('name', 'description')
    ordering = ('-date', 'time')

    def acciones(self, obj):
        edit_url = reverse('admin:events_event_change', args=[obj.id])
        delete_url = reverse('admin:events_event_delete', args=[obj.id])
        return format_html(
            '<a class="button" href="{}">Editar</a> '
            '<a class="button" href="{}">Eliminar</a>',
            edit_url,
            delete_url
        )
    acciones.short_description = 'Acciones'
