from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status

from apps.tasks.models import Task

class TaskTest(TestCase):
    def setUp(self) -> None:
        """
        Setup method to create a user for testing.
        """
        self.user: User = User.objects.create(username='test_username')

    def test_post_success(self) -> None:
        """
        Test for successful creation of a task via POST request.
        """
        url: str = reverse('task-list')
        self.client.force_login(self.user)

        request_data: dict = {
            'title': 'test_title',
            'description': 'test_description',
        }

        response = self.client.post(url, data=request_data)
        new_created_task_id: int = response.json().get('id')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        new_created_task: Task = Task.objects.get(id=new_created_task_id)
        self.assertIsNotNone(new_created_task)
        self.assertEqual(new_created_task.title, request_data['title'])
        self.assertEqual(new_created_task.description, request_data['description'])
        self.assertEqual(new_created_task.user, self.user)

    def test_post_fail(self) -> None:
        """
        Test for failure cases in POST request.
        """
        url: str = reverse('task-list')

        request_data: dict = {
            'title': 'test_title',
            'description': 'test_description',
        }

        # Test UnAuthorized users
        response = self.client.post(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        # Test invalid request data
        self.client.force_login(self.user)
        request_data.pop('title')
        response = self.client.post(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_success(self) -> None:
        """
        Test for successful retrieval of a task via GET request.
        """
        task: Task = Task.objects.create(user=self.user)
        url: str = reverse('task-detail', args=[task.id])
        self.client.force_login(self.user)

        expected_data: dict = {
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'is_done': task.is_done,
            'user': task.user.username,
            'created_at': task.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': task.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
        }

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), expected_data)

    def test_get_fail(self) -> None:
        """
        Test for failure cases in GET request.
        """
        task: Task = Task.objects.create(user=self.user)
        url: str = reverse('task-detail', args=[task.id])
        # Test UnAuthorized Users
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        # Test Wrong User
        self.client.force_login(self.user)
        task.user = User.objects.create(username='test_username_1')
        task.save()
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_success(self) -> None:
        """
        Test for successful update of a task via PATCH request.
        """
        task: Task = Task.objects.create(user=self.user)
        url: str = reverse('task-detail', args=[task.id])
        self.client.force_login(self.user)

        patch_data: dict = {
            'is_done': True
        }

        response = self.client.patch(url, data=patch_data, content_type='application/json')
        task.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(task.is_done, patch_data['is_done'])

    def test_patch_fail(self) -> None:
        """
        Test for failure cases in PATCH request.
        """
        task: Task = Task.objects.create(user=self.user)
        url: str = reverse('task-detail', args=[task.id])

        patch_data: dict = {
            'title': '',
        }

        # Test UnAuthorized Users
        response = self.client.patch(url, data=patch_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        # Test Wrong User
        self.client.force_login(self.user)
        task.user = User.objects.create(username='test_username_1')
        task.save()
        response = self.client.patch(url, data=patch_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        task.user = self.user
        task.save()
        response = self.client.patch(url, data=patch_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
