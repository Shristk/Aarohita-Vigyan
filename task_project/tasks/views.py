from rest_framework import generics, status
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import Task
from .serializers import TaskSerializer

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    
    def get_queryset(self):
        queryset = Task.objects.all()
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter == 'completed':
            queryset = queryset.filter(is_done=True)
        elif status_filter == 'pending':
            queryset = queryset.filter(is_done=False)
        
        # Filter by scheduling
        schedule_filter = self.request.query_params.get('schedule', None)
        if schedule_filter == 'today':
            today = timezone.now().date()
            queryset = queryset.filter(
                Q(due_date__date=today) | Q(scheduled_date__date=today)
            ).filter(is_done=False)
        elif schedule_filter == 'overdue':
            queryset = queryset.filter(
                due_date__lt=timezone.now(),
                is_done=False
            )
        elif schedule_filter == 'upcoming':
            queryset = queryset.filter(
                Q(due_date__gt=timezone.now()) | Q(scheduled_date__gt=timezone.now()),
                is_done=False
            )
        elif schedule_filter == 'scheduled':
            queryset = queryset.filter(
                scheduled_date__isnull=False,
                is_done=False
            )
        
        # Filter by priority
        priority_filter = self.request.query_params.get('priority', None)
        if priority_filter:
            queryset = queryset.filter(priority=priority_filter)
        
        return queryset.distinct()
    
    def create(self, request, *args, **kwargs):
        """Enhanced create method with better error handling"""
        print(f"📝 Received POST data: {request.data}")  # Debug line
        
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(f"❌ Validation errors: {serializer.errors}")  # Debug line
            return Response({
                'error': 'Validation failed',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            task = serializer.save()
            print(f"✅ Task created successfully: {task.title}")  # Debug line
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"❌ Error creating task: {str(e)}")  # Debug line
            return Response({
                'error': 'Failed to create task',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    
    def patch(self, request, *args, **kwargs):
        try:
            task = self.get_object()
            
            # Auto-toggle if no is_done provided in request data
            if 'is_done' not in request.data:
                task.is_done = not task.is_done
                task.save()
                serializer = self.get_serializer(task)
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            return super().patch(request, *args, **kwargs)
        
        except Task.DoesNotExist:
            return Response(
                {"error": "Task not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def delete(self, request, *args, **kwargs):
        try:
            task = self.get_object()
            task_title = task.title
            task.delete()
            
            return Response(
                {"message": f"Task '{task_title}' deleted successfully"}, 
                status=status.HTTP_204_NO_CONTENT
            )
        
        except Task.DoesNotExist:
            return Response(
                {"error": "Task not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to delete task: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
