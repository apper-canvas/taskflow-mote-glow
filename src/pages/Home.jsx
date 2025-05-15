import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import ProjectModal from '../components/ProjectModal';

// Import icons
const ListChecksIcon = getIcon('ListChecks');
const ClipboardListIcon = getIcon('ClipboardList');
const BarChart2Icon = getIcon('BarChart2');
const FolderIcon = getIcon('Folder');
const PlusIcon = getIcon('Plus');

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  }
};

function Home() {
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    pending: 0,
    total: 0
  });
  
  const [showProjectModal, setShowProjectModal] = useState(false);
  
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('taskflow-projects');
    return savedProjects ? JSON.parse(savedProjects) : [];
  });
  
  useEffect(() => {
    // Save projects to localStorage
    localStorage.setItem('taskflow-projects', JSON.stringify(projects));
  }, [projects]);
  
  const addProject = (newProject) => {
    setProjects([...projects, { ...newProject, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
    toast.success("Project created successfully!");
  };
  
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    // Calculate stats whenever tasks change
    const newStats = {
      completed: tasks.filter(task => task.status === 'completed').length,
      inProgress: tasks.filter(task => task.status === 'in-progress').length,
      pending: tasks.filter(task => task.status === 'pending').length,
      total: tasks.length
    };
    setStats(newStats);
    
    // Save tasks to localStorage
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask) => {
    const taskWithId = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    setTasks([...tasks, taskWithId]);
    toast.success("Task added successfully!");
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? {...task, status: newStatus, updatedAt: new Date().toISOString()} : task
    ));
    toast.info("Task status updated!");
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Task deleted successfully!");
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-5xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">
          Your Task Dashboard
        </h1>
        <p className="text-surface-600 dark:text-surface-400 max-w-2xl">
          Welcome to TaskFlow. Organize, prioritize and track your tasks efficiently in one place.
        </p>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div className="card p-4 border-l-4 border-l-primary">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
              <ClipboardListIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400">Total Tasks</h3>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4 border-l-4 border-l-green-500">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/10 dark:bg-green-500/20 rounded-lg">
              <ListChecksIcon className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400">Completed</h3>
              <p className="text-xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4 border-l-4 border-l-secondary">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-secondary/10 dark:bg-secondary/20 rounded-lg">
              <BarChart2Icon className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400">In Progress</h3>
              <p className="text-xl font-bold">{stats.inProgress}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Projects</h2>
          <button
            onClick={() => setShowProjectModal(true)}
            className="btn btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Project</span>
          </button>
        </div>
        
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-4 border border-surface-200 dark:border-surface-700 hover:shadow-md transition-all duration-200"
                style={{ borderLeftWidth: '4px', borderLeftColor: project.color || '#3b82f6' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${project.color}20` }}>
                      <FolderIcon className="h-5 w-5" style={{ color: project.color || '#3b82f6' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      {project.description && (
                        <p className="text-sm text-surface-600 dark:text-surface-400 mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 text-center">
            <FolderIcon className="h-12 w-12 text-surface-400 dark:text-surface-600 mb-3" />
            <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-1">
              No projects yet
            </h3>
            <p className="text-surface-600 dark:text-surface-400 max-w-md mb-4">
              Create your first project to organize your tasks better!
            </p>
          </div>
        )}
        
        <ProjectModal 
          isOpen={showProjectModal} 
          onClose={() => setShowProjectModal(false)} 
          onAdd={addProject} />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-8">
        <MainFeature 
          tasks={tasks}
          onAddTask={addTask}
          onUpdateStatus={updateTaskStatus}
          onDeleteTask={deleteTask}
        />
      </motion.div>

      {tasks.length > 0 && (
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
            {[...tasks]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
              .map(task => (
                <div 
                  key={task.id}
                  className="card p-3 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-medium text-surface-900 dark:text-white">{task.title}</h3>
                    <p className="text-sm text-surface-500">
                      {format(new Date(task.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-xs font-medium
                    ${task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 
                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'}`}>
                    {task.status === 'completed' ? 'Completed' : 
                     task.status === 'in-progress' ? 'In Progress' : 'Pending'}
                  </div>
                </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Home;