from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.urls import reverse
from django.utils.html import format_html
from .models import User

class CustomUserAdmin(BaseUserAdmin):
    add_form = UserCreationForm
    form = UserChangeForm
    model = User
    list_display = ['username', 'role', 'is_active', 'is_staff', 'acciones']

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información personal', {'fields': ('role',)}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'role', 'is_active', 'is_staff', 'is_superuser'),
        }),
    )

    def acciones(self, obj):
        edit_url = reverse('admin:authapp_user_change', args=[obj.id])
        delete_url = reverse('admin:authapp_user_delete', args=[obj.id])
        return format_html(
            '<a class="button" href="{}">Editar</a> '
            '<a class="button" href="{}">Eliminar</a>',
            edit_url,
            delete_url
        )
    acciones.short_description = 'Acciones'

admin.site.register(User, CustomUserAdmin)
