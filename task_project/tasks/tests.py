from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Task

class TaskAPITest(APITestCase):
    def test_create_task(self):
        url = '/api/tasks/'
        data = {'title': 'Test Task'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 1)
        self.assertEqual(Task.objects.get().title, 'Test Task')

    def test_list_tasks(self):
        Task.objects.create(title='Task 1')
        Task.objects.create(title='Task 2', is_done=True)
        
        url = '/api/tasks/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_toggle_task(self):
        task = Task.objects.create(title='Test Task', is_done=False)
        
        url = f'/api/tasks/{task.id}/'
        response = self.client.patch(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        task.refresh_from_db()
        self.assertTrue(task.is_done)