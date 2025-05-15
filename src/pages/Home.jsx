import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Import icons
const ListChecksIcon = getIcon('ListChecks');
const ClipboardListIcon = getIcon('ClipboardList');
const BarChart2Icon = getIcon('BarChart2');

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