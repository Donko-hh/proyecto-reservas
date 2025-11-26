from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Event
from .serializers import EventSerializer

# Create your views here.

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'role', None) == 'admin')

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('date', 'time')
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['date', 'name']

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'activos']:
            return [permissions.AllowAny()]
        return [IsAdmin()]

    @action(detail=False, methods=['get'])
    def activos(self, request):
        qs = Event.objects.filter(is_active=True).order_by('date', 'time')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)