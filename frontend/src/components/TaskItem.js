import React, { useState } from 'react';
import { Check, Trash2, RotateCcw, Clock, Calendar, Flag, AlertTriangle } from 'lucide-react';

const TaskItem = ({ task, onToggle, onDelete, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 1) return `In ${diffDays} days`;
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    
    return formatDate(dateString);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: '#dc2626',
      high: '#ea580c',
      medium: '#d97706',
      low: '#16a34a'
    };
    return colors[priority] || colors.medium;
  };

  const getPriorityEmoji = (priority) => {
    const emojis = {
      urgent: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢'
    };
    return emojis[priority] || emojis.medium;
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  const handleToggle = () => {
    onToggle(task.id, task.is_done);
  };

  return (
    <div 
      className={`task-item ${task.is_done ? 'completed' : 'pending'} ${task.is_overdue ? 'overdue' : ''} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        '--animation-delay': `${index * 0.1}s`,
        '--priority-color': getPriorityColor(task.priority)
      }}
    >
      {/* Priority indicator */}
      <div className="priority-indicator" style={{ backgroundColor: getPriorityColor(task.priority) }}></div>
      
      <div className="task-item-content">
        <div className="task-main-content">
          {/* Status Indicator */}
          <div className="task-status-indicator">
            <div className="status-circle">
              {task.is_done ? (
                <Check className="status-icon completed-icon" size={20} />
              ) : task.is_overdue ? (
                <AlertTriangle className="status-icon overdue-icon" size={16} />
              ) : (
                <Clock className="status-icon pending-icon" size={16} />
              )}
            </div>
          </div>
          
          <div className="task-details">
            <div className="task-header">
              <h3 className="task-title">{task.title}</h3>
              <span className="priority-badge">
                {getPriorityEmoji(task.priority)} {task.priority}
              </span>
            </div>
            
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            
            <div className="task-meta">
              {/* Due Date */}
              {task.due_date && (
                <div className={`meta-item due-date ${task.is_overdue ? 'overdue' : task.is_due_today ? 'due-today' : ''}`}>
                  <Calendar size={12} />
                  <span>Due: {formatRelativeDate(task.due_date)}</span>
                </div>
              )}
              
              {/* Scheduled Date */}
              {task.scheduled_date && (
                <div className={`meta-item scheduled-date ${task.is_scheduled_for_today ? 'scheduled-today' : ''}`}>
                  <Clock size={12} />
                  <span>Scheduled: {formatRelativeDate(task.scheduled_date)}</span>
                </div>
              )}
              
              {/* Created/Completed Date */}
              <div className={`meta-item ${task.is_done ? 'completed' : 'pending'}`}>
                {task.is_done ? (
                  <>
                    <Check size={12} />
                    <span>Completed {formatDate(task.completed_at || task.updated_at)}</span>
                  </>
                ) : (
                  <>
                    <Clock size={12} />
                    <span>Created {formatDate(task.created_at)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="task-actions">
          {/* Complete/Uncomplete Button */}
          {!task.is_done ? (
            <button 
              onClick={handleToggle}
              className="action-btn complete-btn"
              title="Mark as completed"
            >
              <Check size={16} />
            </button>
          ) : (
            <button 
              onClick={handleToggle}
              className="action-btn uncomplete-btn"
              title="Mark as uncompleted"
            >
              <RotateCcw size={16} />
            </button>
          )}
          
          {/* Delete Button */}
          <button 
            onClick={handleDelete} 
            className="action-btn delete-btn"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {task.is_done && <div className="completion-bar"></div>}
      
      <style jsx>{`
        .task-item {
          position: relative;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: slideInUp 0.6s ease-out var(--animation-delay) both;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border-left: 4px solid var(--priority-color);
        }
        
        .task-item:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border-color: rgba(79, 70, 229, 0.4);
          background: rgba(255, 255, 255, 0.8);
        }
        
        .task-item.completed {
          background: rgba(220, 252, 231, 0.8);
          border-color: rgba(34, 197, 94, 0.3);
        }
        
        .task-item.overdue {
          background: rgba(254, 226, 226, 0.8);
          border-color: rgba(239, 68, 68, 0.3);
          border-left-color: #dc2626;
        }
        
        .priority-indicator {
          position: absolute;
          top: 0;
          right: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin: 12px;
        }
        
        .task-item-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-start;
          gap: 20px;
        }
        
        .task-main-content {
          flex: 1;
          display: flex;
          align-items: flex-start;
          gap: 20px;
        }
        
        .task-status-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 4px;
        }
        
        .status-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .task-item.completed .status-circle {
          background: linear-gradient(135deg, #059669 0%, #0891b2 100%);
          box-shadow: 0 0 20px rgba(5, 150, 105, 0.3);
        }
        
        .task-item.overdue .status-circle {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          box-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
        }
        
        .task-item.pending .status-circle {
          background: linear-gradient(135deg, #d97706 0%, #dc2626 100%);
          box-shadow: 0 0 20px rgba(217, 119, 6, 0.3);
        }
        
        .status-icon {
          color: white;
          filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5));
        }
        
        .task-details {
          flex: 1;
          min-width: 0;
        }
        
        .task-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
        }
        
        .task-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          line-height: 1.4;
          word-wrap: break-word;
          transition: all 0.3s ease;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          flex: 1;
        }
        
        .task-item.completed .task-title {
          text-decoration: line-through;
          opacity: 0.8;
          color: #374151;
        }
        
        .priority-badge {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid var(--priority-color);
          color: var(--priority-color);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          white-space: nowrap;
        }
        
        .task-description {
          color: #6b7280;
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0 0 12px 0;
        }
        
        .task-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .meta-item.due-date {
          background: rgba(59, 130, 246, 0.1);
          color: #2563eb;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        
        .meta-item.due-date.due-today {
          background: rgba(251, 146, 60, 0.15);
          color: #ea580c;
          border: 1px solid rgba(251, 146, 60, 0.3);
        }
        
        .meta-item.due-date.overdue {
          background: rgba(239, 68, 68, 0.15);
          color: #dc2626;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        
        .meta-item.scheduled-date {
          background: rgba(168, 85, 247, 0.1);
          color: #7c3aed;
          border: 1px solid rgba(168, 85, 247, 0.2);
        }
        
        .meta-item.scheduled-date.scheduled-today {
          background: rgba(34, 197, 94, 0.15);
          color: #059669;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }
        
        .meta-item.completed {
          background: rgba(34, 197, 94, 0.15);
          color: #059669;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }
        
        .meta-item.pending {
          background: rgba(107, 114, 128, 0.1);
          color: #6b7280;
          border: 1px solid rgba(107, 114, 128, 0.2);
        }
        
        .task-actions {
          display: flex;
          gap: 8px;
          opacity: ${isHovered ? '1' : '0.7'};
          transition: opacity 0.3s ease;
          align-self: flex-start;
          margin-top: 4px;
        }
        
        .action-btn {
          border: 2px solid;
          border-radius: 12px;
          padding: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .action-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
        
        .complete-btn {
          background: rgba(34, 197, 94, 0.15);
          border-color: rgba(34, 197, 94, 0.3);
          color: #059669;
        }
        
        .complete-btn:hover {
          background: rgba(34, 197, 94, 0.25);
          border-color: rgba(34, 197, 94, 0.5);
        }
        
        .uncomplete-btn {
          background: rgba(251, 146, 60, 0.15);
          border-color: rgba(251, 146, 60, 0.3);
          color: #ea580c;
        }
        
        .uncomplete-btn:hover {
          background: rgba(251, 146, 60, 0.25);
          border-color: rgba(251, 146, 60, 0.5);
        }
        
        .delete-btn {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.3);
          color: #dc2626;
        }
        
        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.25);
          border-color: rgba(239, 68, 68, 0.5);
        }
        
        .completion-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #059669, #0891b2);
          border-radius: 0 0 20px 20px;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .task-item {
            padding: 20px;
          }
          
          .task-header {
            flex-direction: column;
            gap: 8px;
          }
          
          .task-actions {
            opacity: 1;
          }
          
          .meta-item {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TaskItem;
