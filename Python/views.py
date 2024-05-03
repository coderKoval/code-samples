from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from apps.tasks.models import Task
from apps.tasks.serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    """
    Viewset for handling CRUD operations on Task model.
    """
    queryset: Task.objects.all().order_by('-pk') = Task.objects.all().order_by('-pk')
    serializer_class: TaskSerializer = TaskSerializer
    filter_backends: list = [DjangoFilterBackend]
    filterset_fields: list = ['is_done']
    permission_classes: list = [IsAuthenticated]

    def get_queryset(self) -> Task.objects.filter(user=self.request.user):
        """
        Get queryset based on user permissions.
        """
        user: User = self.request.user
        if user.is_superuser:
            return Task.objects.all()
        return Task.objects.filter(user=user)

    def create(self, request, *args, **kwargs) -> Response:
        """
        Create a new task.
        """
        serializer: TaskSerializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs) -> Response:
        """
        Update an existing task.
        """
        instance: Task = self.get_object()
        serializer: TaskSerializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs) -> Response:
        """
        Delete an existing task.
        """
        instance: Task = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
