import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, X, CheckCircle, Clock, Target, Trash, Calendar, Flag } from 'lucide-react';
import { taskAPI } from './services/api';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch tasks with optional filter
  const fetchTasks = async (filter = null) => {
    try {
      setLoading(true);
      setError('');
      const response = await taskAPI.getTasks(filter);
      
      if (response.data && Array.isArray(response.data)) {
        setTasks(response.data);
      } else if (response.data && Array.isArray(response.data.results)) {
        setTasks(response.data.results);
      } else {
        console.error('API response is not an array:', response.data);
        setTasks([]);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(`Failed to fetch tasks: ${err.message}`);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Create task (now accepts full task object)
  const handleTaskAdded = async (taskData) => {
  try {
    setIsSubmitting(true);
    setError('');
    const response = await taskAPI.createTask(taskData);
    
    if (response.data) {
      setTasks(prev => Array.isArray(prev) ? [response.data, ...prev] : [response.data]);
    }
  } catch (err) {
    console.error('Error creating task:', err);
    
    // Enhanced error message handling
    let errorMessage = 'Failed to create task';
    
    if (err.response?.status === 400) {
      // Handle validation errors
      if (err.userFriendlyMessage) {
        errorMessage = err.userFriendlyMessage;
      } else if (err.response?.data) {
        const validationData = err.response.data;
        const errorMessages = [];
        
        Object.entries(validationData).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            errorMessages.push(...messages);
          } else if (typeof messages === 'string') {
            errorMessages.push(messages);
          }
        });
        
        if (errorMessages.length > 0) {
          errorMessage = errorMessages.join(' ');
        }
      }
    } else {
      errorMessage = `Failed to create task: ${err.message}`;
    }
    
    setError(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  // Toggle task
  const handleToggle = async (taskId, currentStatus) => {
    try {
      const response = await taskAPI.updateTask(taskId, { is_done: !currentStatus });
      
      if (response.data) {
        setTasks(prev =>
          Array.isArray(prev) ? prev.map(task =>
            task.id === taskId ? response.data : task
          ) : []
        );
      }
    } catch (err) {
      console.error('Error toggling task:', err);
      setError(`Failed to update task: ${err.message}`);
    }
  };

  // Delete single task
  const handleDelete = async (taskId) => {
    try {
      await taskAPI.deleteTask(taskId);
      setTasks(prev => Array.isArray(prev) ? prev.filter(task => task.id !== taskId) : []);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(`Failed to delete task: ${err.message}`);
    }
  };

  // Bulk delete completed tasks
  const handleBulkDelete = async (taskIds) => {
    try {
      await Promise.all(taskIds.map(id => taskAPI.deleteTask(id)));
      setTasks(prev => Array.isArray(prev) ? prev.filter(task => !taskIds.includes(task.id)) : []);
    } catch (err) {
      console.error('Error bulk deleting tasks:', err);
      setError(`Failed to delete tasks: ${err.message}`);
    }
  };

  // Filter change handler
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    fetchTasks(filter === 'all' ? null : filter);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Categorize tasks
  const pendingTasks = Array.isArray(tasks) ? tasks.filter(task => !task.is_done) : [];
  const completedTasks = Array.isArray(tasks) ? tasks.filter(task => task.is_done) : [];
  const overdueTasks = Array.isArray(tasks) ? tasks.filter(task => task.is_overdue) : [];
  const todayTasks = Array.isArray(tasks) ? tasks.filter(task => task.is_due_today || task.is_scheduled_for_today) : [];
  const scheduledTasks = Array.isArray(tasks) ? tasks.filter(task => task.scheduled_date && !task.is_done) : [];
  
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const filterButtons = [
    { key: 'all', label: 'All Tasks', icon: Target },
    { key: 'pending', label: 'Pending', icon: Clock },
    { key: 'completed', label: 'Completed', icon: CheckCircle },
    { key: 'today', label: 'Today', icon: Calendar },
    { key: 'overdue', label: 'Overdue', icon: AlertCircle },
    { key: 'scheduled', label: 'Scheduled', icon: Flag },
  ];

  return (
    <div className="app-container">
      {/* Animated Background */}
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="main-content">
        {/* Header */}
        <div className="header-card">
          <div className="header-content">
            <div className="header-icon">
              <Calendar className="calendar-icon" />
            </div>
            <h1 className="main-title">Task Scheduler Pro</h1>
            <p className="subtitle">Plan • Schedule • Execute • Achieve</p>
            
            {/* Progress Circle */}
            {Array.isArray(tasks) && tasks.length > 0 && (
              <div className="progress-container">
                <div className="progress-circle" style={{'--progress': `${completionRate}%`}}>
                  <span className="progress-text">{completionRate}%</span>
                </div>
                <p className="progress-label">Completed</p>
              </div>
            )}
          </div>
        </div>

        {/* Error Toast */}
        {error && (
          <div className="error-toast">
            <AlertCircle className="error-icon" />
            <span className="error-message">{error}</span>
            <button onClick={() => setError('')} className="error-close">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Add Task Section */}
        <div className="add-task-section">
          <AddTaskForm
            onTaskAdded={handleTaskAdded}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Filter Buttons */}
        <div className="filter-section">
          <div className="filter-buttons">
            {filterButtons.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleFilterChange(key)}
                className={`filter-btn ${activeFilter === key ? 'active' : ''}`}
              >
                <Icon size={16} />
                {label}
                {key === 'overdue' && overdueTasks.length > 0 && (
                  <span className="badge overdue-badge">{overdueTasks.length}</span>
                )}
                {key === 'today' && todayTasks.length > 0 && (
                  <span className="badge today-badge">{todayTasks.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Stats Dashboard */}
        <div className="stats-dashboard">
          <div className="stat-card">
            <div className="stat-icon stat-pending">
              <Clock size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{pendingTasks.length}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon stat-completed">
              <CheckCircle size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{completedTasks.length}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon stat-overdue">
              <AlertCircle size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{overdueTasks.length}</div>
              <div className="stat-label">Overdue</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-scheduled">
              <Calendar size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{scheduledTasks.length}</div>
              <div className="stat-label">Scheduled</div>
            </div>
          </div>

          <button onClick={() => fetchTasks(activeFilter === 'all' ? null : activeFilter)} disabled={loading} className="refresh-btn">
            <RefreshCw className={`refresh-icon ${loading ? 'spinning' : ''}`} size={16} />
            Refresh
          </button>
        </div>

        {/* Task Lists */}
        <div className="task-lists-container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
              </div>
              <p className="loading-text">Loading your tasks...</p>
            </div>
          ) : (
            <>
              {/* Show different sections based on active filter */}
              {activeFilter === 'all' && (
                <>
                  {overdueTasks.length > 0 && (
                    <TaskList
                      tasks={overdueTasks}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                      onBulkDelete={handleBulkDelete}
                      title="🚨 Overdue Tasks"
                      type="overdue"
                    />
                  )}
                  
                  {todayTasks.length > 0 && (
                    <TaskList
                      tasks={todayTasks}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                      onBulkDelete={handleBulkDelete}
                      title="📅 Today's Tasks"
                      type="today"
                    />
                  )}
                  
                  {pendingTasks.length > 0 && (
                    <TaskList
                      tasks={pendingTasks}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                      onBulkDelete={handleBulkDelete}
                      title="📋 To Do"
                      type="pending"
                    />
                  )}

                  {completedTasks.length > 0 && (
                    <TaskList
                      tasks={completedTasks}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                      onBulkDelete={handleBulkDelete}
                      title="✅ Completed"
                      type="completed"
                    />
                  )}
                </>
              )}

              {/* Filtered views */}
              {activeFilter !== 'all' && tasks.length > 0 && (
                <TaskList
                  tasks={tasks}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onBulkDelete={handleBulkDelete}
                  title={`${filterButtons.find(f => f.key === activeFilter)?.label} Tasks`}
                  type={activeFilter}
                />
              )}

              {/* Empty State */}
              {(!Array.isArray(tasks) || tasks.length === 0) && (
                <div className="empty-state">
                  <div className="empty-icon">🎯</div>
                  <h3 className="empty-title">Ready to get organized?</h3>
                  <p className="empty-description">
                    Create your first task with a schedule and priority to start your productive journey!
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="footer">
          <p className="footer-text">
            Powered by Django REST API • Task Scheduling Made Simple
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .calendar-icon {
          width: 40px;
          height: 40px;
          color: #4f46e5;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .filter-section {
          margin-bottom: 30px;
        }
        
        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }
        
        .filter-btn {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          padding: 12px 20px;
          color: #374151;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .filter-btn:hover {
          background: rgba(255, 255, 255, 0.6);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .filter-btn.active {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          border-color: transparent;
          box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);
        }
        
        .badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #dc2626;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
        }
        
        .today-badge {
          background: #f59e0b;
        }
        
        .stat-overdue {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        }
        
        .stat-scheduled {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }
        
        @media (max-width: 768px) {
          .filter-buttons {
            gap: 8px;
          }
          
          .filter-btn {
            padding: 10px 16px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
