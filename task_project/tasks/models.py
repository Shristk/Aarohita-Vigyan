from django.db import models
from django.utils import timezone

class Task(models.Model):
    description = models.TextField(blank=True, null=True)
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    PRIORITY_ORDER = {
        'urgent': 4,
        'high': 3,
        'medium': 2,
        'low': 1,
    }
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    is_done = models.BooleanField(default=False)
    
    # Scheduling fields
    due_date = models.DateTimeField(blank=True, null=True)
    scheduled_date = models.DateTimeField(blank=True, null=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    
    # Priority order field for database sorting
    priority_order = models.IntegerField(default=2)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        # Now we can use priority_order in ordering
        ordering = ['-priority_order', '-created_at']

    @property
    def is_overdue(self):
        """Check if task is overdue"""
        if self.due_date and not self.is_done:
            return timezone.now() > self.due_date
        return False
    
    @property
    def is_due_today(self):
        """Check if task is due today"""
        if self.due_date and not self.is_done:
            return self.due_date.date() == timezone.now().date()
        return False
    
    @property
    def is_scheduled_for_today(self):
        """Check if task is scheduled for today"""
        if self.scheduled_date:
            return self.scheduled_date.date() == timezone.now().date()
        return False

    def save(self, *args, **kwargs):
        # Auto-set priority_order based on priority
        self.priority_order = self.PRIORITY_ORDER.get(self.priority, 2)
        
        # Set completed_at when task is marked as done
        if self.is_done and not self.completed_at:
            self.completed_at = timezone.now()
        elif not self.is_done:
            self.completed_at = None
            
        super().save(*args, **kwargs)

    def __str__(self):
        status = '✓' if self.is_done else '○'
        priority_emoji = {'urgent': '🔴', 'high': '🟠', 'medium': '🟡', 'low': '🟢'}
        return f"{status} {priority_emoji.get(self.priority, '🟡')} {self.title}"
