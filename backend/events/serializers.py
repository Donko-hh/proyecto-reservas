from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    reserved_seats = serializers.SerializerMethodField()
    available_seats = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'name', 'description', 'date', 'time',
            'duration_minutes', 'capacity',
            'reserved_seats', 'available_seats',
            'is_active'
        ]

    def get_reserved_seats(self, obj):
        try:
            return obj.reserved_seats
        except Exception:
            return 0

    def get_available_seats(self, obj):
        try:
            return obj.available_seats
        except Exception:
            return 0
