from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Reservation
from .serializers import ReservationSerializer, MyReservationSerializer

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'role', None) == 'admin')

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.select_related('user', 'event').all().order_by('-created_at')

    def get_serializer_class(self):
        if self.action in ['my', 'history']:
            return MyReservationSerializer
        return ReservationSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAdmin()]
        if self.action in ['create', 'my', 'cancel', 'mark_attendance', 'history']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        if self.action == 'my':
            return Reservation.objects.filter(user=self.request.user, status='active').select_related('event')
        if self.action == 'history':
            return Reservation.objects.filter(user=self.request.user).exclude(status='active').select_related('event')
        if self.action in ['cancel', 'mark_attendance']:
            return Reservation.objects.select_related('event')
        return super().get_queryset()

    @action(detail=False, methods=['get'])
    def my(self, request):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def history(self, request):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        reservation = self.get_object()
        if reservation.status == 'cancelled':
            return Response({'status': 'ya cancelada'})
        if reservation.user != request.user and getattr(request.user, 'role', None) != 'admin':
            return Response({'error': 'Sin permisos.'}, status=status.HTTP_403_FORBIDDEN)
        reservation.status = 'cancelled'
        reservation.save()
        return Response({'status': 'cancelled'})

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def mark_attendance(self, request, pk=None):
        reservation = self.get_object()
        reservation.attended = True
        reservation.save()
        return Response({'attended': True})
