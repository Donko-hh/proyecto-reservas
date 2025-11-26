from rest_framework import serializers
from django.db import IntegrityError
from .models import Reservation
from events.serializers import EventSerializer
import logging

logger = logging.getLogger(__name__)

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['id', 'user', 'event', 'seats', 'status', 'attended', 'created_at']
        read_only_fields = ['status', 'attended', 'created_at', 'user']

    def validate(self, attrs):
        seats = attrs.get('seats')
        event = attrs.get('event')

        if seats is None or seats <= 0:
            raise serializers.ValidationError({'seats': 'Debe ser un entero positivo.'})

        if not event.is_active:
            raise serializers.ValidationError({'event': 'El evento no está activo.'})

        reserved = sum(r.seats for r in event.reservations.filter(status='active'))
        available = event.capacity - reserved

        if available <= 0:
            raise serializers.ValidationError({'seats': 'Este evento ya no tiene cupos disponibles.'})

        if seats > available:
            raise serializers.ValidationError({'seats': f'No hay cupos suficientes. Disponibles: {available}.'})

        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user
        try:
            instance = super().create(validated_data)
            logger.info(f"Reserva creada: usuario={request.user.username}, evento={instance.event.id}, cantidad={instance.seats}")
            return instance
        except IntegrityError:
            raise serializers.ValidationError({
                'event': 'Ya tienes una reserva activa para este evento.'
            })

class MyReservationSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    # 🔧 CAMBIO: añadimos campos calculados para que el frontend los reciba
    user_username = serializers.CharField(source='user.username', read_only=True)
    event_name = serializers.CharField(source='event.name', read_only=True)

    class Meta:
        model = Reservation
        fields = ['id', 'event', 'event_name', 'user_username', 'seats', 'status', 'attended', 'created_at']
