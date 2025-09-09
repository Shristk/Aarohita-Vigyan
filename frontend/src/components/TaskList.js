import React, { useState } from 'react';
import { Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onToggle, onDelete, title, emptyMessage, type, onBulkDelete }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  if (tasks.length === 0) {
    return null;
  }

  const getHeaderStyle = () => {
    if (type === 'completed') {
      return {
        background: 'linear-gradient(135deg, #059669 0%, #0891b2 100%)',
        color: '#ffffff'
      };
    }
    return {
      background: 'linear-gradient(135deg, #d97706 0%, #dc2626 100%)',
      color: '#ffffff'
    };
  };

  const handleBulkDelete = () => {
    if (type === 'completed') {
      setShowConfirmDialog(true);
    }
  };

  const confirmBulkDelete = () => {
    const completedTaskIds = tasks.filter(task => task.is_done).map(task => task.id);
    onBulkDelete(completedTaskIds);
    setShowConfirmDialog(false);
  };

  const cancelBulkDelete = () => {
    setShowConfirmDialog(false);
  };

  return (
    <div className="task-list-container">
      <div className="task-list-header" style={getHeaderStyle()}>
        <div className="header-left">
          <h2 className="task-list-title">{title}</h2>
          <span className="task-count">{tasks.length}</span>
        </div>
        
        {type === 'completed' && tasks.length > 0 && (
          <div className="header-actions">
            <button 
              onClick={handleBulkDelete}
              className="bulk-delete-btn"
              title="Delete all completed tasks"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          </div>
        )}
      </div>
      
      <div className="task-list-grid">
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            index={index}
          />
        ))}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <div className="dialog-icon">
              <AlertTriangle size={48} />
            </div>
            <h3 className="dialog-title">Delete All Completed Tasks?</h3>
            <p className="dialog-message">
              This will permanently delete all {tasks.length} completed task{tasks.length !== 1 ? 's' : ''}. 
              This action cannot be undone.
            </p>
            <div className="dialog-actions">
              <button onClick={cancelBulkDelete} className="cancel-btn">
                Cancel
              </button>
              <button onClick={confirmBulkDelete} className="confirm-btn">
                <Trash2 size={16} />
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .task-list-container {
          margin-bottom: 40px;
          animation: fadeInUp 0.6s ease-out;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }
        
        .task-list-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          padding: 16px 24px;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .task-list-title {
          font-size: 1.4rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          margin: 0;
        }
        
        .task-count {
          background: rgba(255, 255, 255, 0.25);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
        }
        
        .header-actions {
          display: flex;
          gap: 12px;
        }
        
        .bulk-delete-btn {
          background: rgba(239, 68, 68, 0.2);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        .bulk-delete-btn:hover {
          background: rgba(239, 68, 68, 0.4);
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }
        
        .task-list-grid {
          display: grid;
          gap: 16px;
        }
        
        /* Confirmation Dialog Styles */
        .confirmation-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }
        
        .confirmation-dialog {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-radius: 24px;
          padding: 32px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          animation: scaleIn 0.3s ease-out;
        }
        
        .dialog-icon {
          color: #f59e0b;
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
        }
        
        .dialog-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 12px;
        }
        
        .dialog-message {
          color: #4b5563;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        
        .dialog-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        
        .cancel-btn {
          background: rgba(107, 114, 128, 0.15);
          border: 2px solid rgba(107, 114, 128, 0.3);
          color: #374151;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .cancel-btn:hover {
          background: rgba(107, 114, 128, 0.25);
          border-color: rgba(107, 114, 128, 0.5);
          transform: scale(1.05);
        }
        
        .confirm-btn {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          border: 2px solid transparent;
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        }
        
        .confirm-btn:hover {
          background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @media (max-width: 768px) {
          .task-list-container {
            padding: 20px;
          }
          
          .task-list-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }
          
          .header-left {
            justify-content: space-between;
          }
          
          .task-list-title {
            font-size: 1.2rem;
          }
          
          .task-list-header {
            padding: 12px 20px;
            margin-bottom: 20px;
          }
          
          .task-list-grid {
            gap: 12px;
          }
          
          .confirmation-dialog {
            padding: 24px;
            margin: 20px;
          }
          
          .dialog-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default TaskList;
