from django.contrib.auth.models import User
from django.db import models


class Task(models.Model):
    title: models.CharField = models.CharField(max_length=255, null=False, blank=False)
    description: models.TextField = models.TextField(null=False, blank=False)
    is_done: models.BooleanField = models.BooleanField(default=False)
    user: models.ForeignKey = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_tasks')
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together: tuple = ('title', 'user')

    def __str__(self) -> str:
        """
        Returns a string representation of the Task instance.
        """
        return self.title
