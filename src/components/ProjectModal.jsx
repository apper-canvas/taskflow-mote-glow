import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const XIcon = getIcon('X');
const FolderPlusIcon = getIcon('FolderPlus');

const ProjectModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6', // Default to primary color
    client: '',
    status: 'planning',
    startDate: '',
    endDate: '',
    summary: '',
    notes: ''
  });
  
  const colorOptions = [
    { value: '#3b82f6', label: 'Blue' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#f59e0b', label: 'Amber' },
    { value: '#10b981', label: 'Emerald' },
    { value: '#ef4444', label: 'Red' },
    { value: '#6366f1', label: 'Indigo' },
    { value: '#ec4899', label: 'Pink' },
  ];

  const statusOptions = [
    { value: 'planning', label: 'Planning' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Project name cannot be empty!");
      return;
    }
    
    onAdd(formData);
    setFormData({
      name: '',
      description: '',
      color: '#3b82f6',
      client: '',
      status: 'planning',
      startDate: '',
      endDate: '',
      summary: '',
      notes: ''
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            style={{ pointerEvents: 'none' }}
          >
            <div 
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-lg w-full p-6"
              style={{ pointerEvents: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <FolderPlusIcon className="h-6 w-6 text-primary dark:text-primary-light" />
                  <h2 className="text-xl font-bold text-surface-900 dark:text-white">Create New Project</h2>
                </div>
                <button 
                  className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
                  <div className="input-group">
                    <label htmlFor="name" className="input-label">
                      Project Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter project name"
                      className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-lg"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="input-group">
                      <label htmlFor="client" className="input-label">
                        Client
                      </label>
                      <input
                        type="text"
                        id="client"
                        name="client"
                        value={formData.client}
                        onChange={handleInputChange}
                        placeholder="Client name"
                        className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-lg"
                      />
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
                        className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-lg"
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="input-group">
                      <label htmlFor="startDate" className="input-label">
                        Start Date
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-lg"
                      />
                    </div>
                    
                    <div className="input-group">
                      <label htmlFor="endDate" className="input-label">
                        End Date
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="summary" className="input-label">Project Summary</label>
                    <textarea
                      id="summary"
                      name="summary"
                      value={formData.summary}
                      onChange={handleInputChange}
                      placeholder="Brief summary of the project"
                      className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-lg"
                      rows="2"
                    />
                  </div>


                  
                  <div className="input-group">
                    <label htmlFor="description" className="input-label">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter project description"
                      className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-lg min-h-[80px]"
                      rows="3"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="notes" className="input-label">Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Additional notes or comments"
                      className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-lg"
                      rows="3"
                    />
                  </div>
                  
                  <div className="input-group">
                    <label className="input-label">Project Color</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {colorOptions.map(color => (
                        <button
                          key={color.value}
                          type="button"
                          aria-label={`Select ${color.label} color`}
                          className={`color-option ${formData.color === color.value ? 'color-option-selected' : ''}`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setFormData({ ...formData, color: color.value })}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;