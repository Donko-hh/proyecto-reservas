from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum
from events.models import Event
from reservations.models import Reservation

# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ocupacion_report(request):
    data = []
    for event in Event.objects.all():
        reserved = Reservation.objects.filter(event=event, status='active').aggregate(total=Sum('seats'))['total'] or 0
        data.append({
            'event_id': event.id,
            'name': event.name,
            'capacity': event.capacity,
            'reserved': reserved,
            'available': max(event.capacity - reserved, 0),
        })
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def asistencia_report(request):
    data = []
    for event in Event.objects.all():
        attended = Reservation.objects.filter(event=event, attended=True).count()
        total_reservations = Reservation.objects.filter(event=event).count()
        data.append({
            'event_id': event.id,
            'name': event.name,
            'attended': attended,
            'total_reservations': total_reservations,
        })
    return Response(data)