import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Import icons
const PlusIcon = getIcon('Plus');
const XIcon = getIcon('X');
const CheckIcon = getIcon('Check');
const ClockIcon = getIcon('Clock');
const AlertCircleIcon = getIcon('AlertCircle');
const TrashIcon = getIcon('Trash');
const PencilIcon = getIcon('Pencil');
const CheckCircleIcon = getIcon('CheckCircle');
const ClipboardIcon = getIcon('Clipboard');

const MainFeature = ({ tasks, onAddTask, onUpdateStatus, onDeleteTask }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending'
  });
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Task title cannot be empty!");
      return;
    }
    
    if (editingTask) {
      // Update existing task
      const updatedTask = { ...editingTask, ...formData };
      onAddTask(updatedTask);
      setEditingTask(null);
    } else {
      // Add new task
      onAddTask(formData);
    }
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending'
    });
    setShowForm(false);
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status
    });
    setEditingTask(task);
    setShowForm(true);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <AlertCircleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="p-4 md:p-6 border-b border-surface-200 dark:border-surface-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1">Task Management</h2>
          <p className="text-surface-600 dark:text-surface-400 text-sm">
            Create, organize and manage your tasks efficiently
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-3 pr-10 py-2 text-sm bg-surface-100 dark:bg-surface-800 border-0 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Tasks</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          
          <button
            onClick={() => {
              setEditingTask(null);
              setFormData({
                title: '',
                description: '',
                priority: 'medium',
                status: 'pending'
              });
              setShowForm(!showForm);
            }}
            className="btn btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {showForm ? (
              <>
                <XIcon className="h-4 w-4" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <PlusIcon className="h-4 w-4" />
                <span>Add Task</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-4 md:p-6 bg-surface-50 dark:bg-surface-800/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="input-group md:col-span-2">
                  <label htmlFor="title" className="input-label">
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                    className="w-full p-2 border"
                    required
                  />
                </div>
                
                <div className="input-group md:col-span-2">
                  <label htmlFor="description" className="input-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter task description"
                    className="w-full p-2 border min-h-[80px]"
                    rows="3"
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="priority" className="input-label">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full p-2 border"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="input-group">
                  <label htmlFor="status" className="input-label">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2 border"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="p-4 md:p-6">
        {filteredTasks.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="card p-4 border border-surface-200 dark:border-surface-700 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className={`p-2 rounded-full ${
                          task.status === 'completed' 
                            ? 'bg-green-100 dark:bg-green-900/30' 
                            : task.status === 'in-progress' 
                              ? 'bg-blue-100 dark:bg-blue-900/30' 
                              : 'bg-yellow-100 dark:bg-yellow-900/30'
                        }`}
                      >
                        {getStatusIcon(task.status)}
                      </div>
                      
                      <div>
                        <h3 className={`font-semibold ${
                          task.status === 'completed' ? 'line-through text-surface-500 dark:text-surface-400' : ''
                        }`}>
                          {task.title}
                        </h3>
                        
                        {task.description && (
                          <p className="text-sm text-surface-600 dark:text-surface-400 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end gap-2 sm:gap-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityStyles(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                      
                      <div className="flex gap-1">
                        {task.status !== 'completed' && (
                          <button 
                            onClick={() => onUpdateStatus(task.id, 'completed')}
                            className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                            aria-label="Mark as complete"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                        )}
                        
                        {task.status === 'completed' && (
                          <button 
                            onClick={() => onUpdateStatus(task.id, 'pending')}
                            className="p-1 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded"
                            aria-label="Mark as pending"
                          >
                            <AlertCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                        
                        <button 
                          onClick={() => handleEdit(task)}
                          className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                          aria-label="Edit task"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        
                        <button 
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                          aria-label="Delete task"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ClipboardIcon className="h-12 w-12 text-surface-400 dark:text-surface-600 mb-3" />
            <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-1">
              No tasks found
            </h3>
            <p className="text-surface-600 dark:text-surface-400 max-w-md mb-4">
              {filter === 'all' 
                ? "You don't have any tasks yet. Create your first task to get started!"
                : `You don't have any ${filter.replace('-', ' ')} tasks.`}
            </p>
            
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="btn btn-secondary"
              >
                View all tasks
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainFeature;