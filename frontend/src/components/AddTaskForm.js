import React, { useState } from 'react';
import { Plus, RefreshCw, Target, Calendar, Clock, Flag } from 'lucide-react';

const AddTaskForm = ({ onTaskAdded, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    scheduled_date: '',
    priority: 'medium'
  });
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
        scheduled_date: formData.scheduled_date ? new Date(formData.scheduled_date).toISOString() : null,
      };
      
      onTaskAdded(taskData);
      setFormData({
        title: '',
        description: '',
        due_date: '',
        scheduled_date: '',
        priority: 'medium'
      });
    }
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

  return (
    <div className="add-task-form">
      <form onSubmit={handleSubmit} className="task-form">
        {/* Title Input */}
        <div className={`input-container ${isFocused ? 'focused' : ''}`}>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="What would you like to accomplish?"
            className="task-input"
            disabled={isSubmitting}
            maxLength={200}
            required
          />
          <div className="input-decoration">
            <Target className="target-decoration" size={18} />
          </div>
        </div>

        {/* Description Input */}
        <div className="input-container">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add description (optional)"
            className="task-textarea"
            disabled={isSubmitting}
            maxLength={500}
            rows={2}
          />
        </div>

        {/* Scheduling and Priority Row */}
        <div className="form-row">
          {/* Due Date */}
          <div className="input-group">
            <label className="input-label">
              <Calendar size={16} />
              Due Date
            </label>
            <input
              type="datetime-local"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="date-input"
              disabled={isSubmitting}
            />
          </div>

          {/* Scheduled Date */}
          <div className="input-group">
            <label className="input-label">
              <Clock size={16} />
              Scheduled For
            </label>
            <input
              type="datetime-local"
              name="scheduled_date"
              value={formData.scheduled_date}
              onChange={handleChange}
              className="date-input"
              disabled={isSubmitting}
            />
          </div>

          {/* Priority */}
          <div className="input-group">
            <label className="input-label">
              <Flag size={16} />
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="priority-select"
              disabled={isSubmitting}
              style={{ borderColor: getPriorityColor(formData.priority) }}
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🟠 High</option>
              <option value="urgent">🔴 Urgent</option>
            </select>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !formData.title.trim()}
          className="add-task-btn"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="btn-icon spinning" size={20} />
              Creating...
            </>
          ) : (
            <>
              <Plus className="btn-icon" size={20} />
              Create Task {getPriorityEmoji(formData.priority)}
            </>
          )}
        </button>
      </form>
      
      <style jsx>{`
        .add-task-form {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          margin-bottom: 30px;
        }
        
        .task-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .input-container {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .input-container.focused {
          transform: translateY(-2px);
        }
        
        .task-input, .task-textarea {
          width: 100%;
          padding: 18px 55px 18px 24px;
          border: 2px solid rgba(79, 70, 229, 0.2);
          border-radius: 18px;
          font-size: 1.05rem;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          color: #1f2937;
          transition: all 0.3s ease;
          outline: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          font-family: inherit;
          resize: vertical;
        }
        
        .task-textarea {
          padding: 18px 24px;
          min-height: 60px;
        }
        
        .task-input:focus, .task-textarea:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1);
          background: rgba(255, 255, 255, 1);
        }
        
        .task-input::placeholder, .task-textarea::placeholder {
          color: #6b7280;
          font-weight: 500;
        }
        
        .input-decoration {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
        
        .target-decoration {
          color: #4f46e5;
          opacity: 0.6;
          animation: targetGlow 3s ease-in-out infinite;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }
        
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .input-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #374151;
        }
        
        .date-input, .priority-select {
          padding: 12px 16px;
          border: 2px solid rgba(107, 114, 128, 0.2);
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.95);
          color: #1f2937;
          transition: all 0.3s ease;
          outline: none;
        }
        
        .date-input:focus, .priority-select:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        
        .priority-select {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .add-task-btn {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 18px;
          padding: 18px 28px;
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(79, 70, 229, 0.35);
          margin-top: 8px;
        }
        
        .add-task-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(79, 70, 229, 0.45);
          background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
        }
        
        .add-task-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .btn-icon.spinning {
          animation: spin 1s linear infinite;
        }
        
        @keyframes targetGlow {
          0%, 100% { opacity: 0.6; transform: translateY(-50%) scale(1); }
          50% { opacity: 1; transform: translateY(-50%) scale(1.1); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .add-task-form {
            padding: 24px;
          }
          
          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .input-group {
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default AddTaskForm;
