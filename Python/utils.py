from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault

from apps.tasks.models import Task

class TaskSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=CurrentUserDefault())

    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
    updated_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'is_done', 'user', 'created_at', 'updated_at']

    def to_representation(self, instance: Task) -> dict:
        """
        Convert Task model instance to a dictionary representation.
        """
        data = super(TaskSerializer, self).to_representation(instance)
        data.update({"user": instance.user.username})
        return data
