from rest_framework import serializers
from django.utils import timezone
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    # Explicitly define optional fields to prevent validation errors
    description = serializers.CharField(
        allow_blank=True, 
        required=False, 
        allow_null=True,
        max_length=500
    )
    due_date = serializers.DateTimeField(
        required=False, 
        allow_null=True
    )
    scheduled_date = serializers.DateTimeField(
        required=False, 
        allow_null=True
    )
    priority = serializers.CharField(
        max_length=10,
        default='medium',
        required=False
    )
    
    # Read-only fields for computed properties
    is_overdue = serializers.ReadOnlyField()
    is_due_today = serializers.ReadOnlyField()
    is_scheduled_for_today = serializers.ReadOnlyField()
    
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'is_done', 
            'due_date', 'scheduled_date', 'priority', 'priority_order',
            'created_at', 'updated_at', 'completed_at',
            'is_overdue', 'is_due_today', 'is_scheduled_for_today'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'completed_at', 'priority_order']

    def validate_title(self, value):
        """Ensure title is not empty"""
        if not value or not value.strip():
            raise serializers.ValidationError("Title is required and cannot be empty.")
        return value.strip()
    
    def validate_due_date(self, value):
        """Validate due date is not in the past"""
        if value and value < timezone.now():
            raise serializers.ValidationError("Due date cannot be in the past.")
        return value
    
    def validate_scheduled_date(self, value):
        """Validate scheduled date is not in the past"""
        if value and value < timezone.now():
            raise serializers.ValidationError("Scheduled date cannot be in the past.")
        return value
    
    def validate_priority(self, value):
        """Ensure priority is valid"""
        valid_priorities = ['low', 'medium', 'high', 'urgent']
        if value and value not in valid_priorities:
            raise serializers.ValidationError(f"Priority must be one of: {', '.join(valid_priorities)}")
        return value
    
    def validate(self, data):
        """Cross-field validation"""
        due_date = data.get('due_date')
        scheduled_date = data.get('scheduled_date')
        
        if due_date and scheduled_date and scheduled_date > due_date:
            raise serializers.ValidationError({
                'scheduled_date': 'Scheduled date cannot be after due date.'
            })
        
        return data
