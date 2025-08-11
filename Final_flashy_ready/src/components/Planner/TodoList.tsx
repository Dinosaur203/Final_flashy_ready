import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, CheckSquare, Square, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';
import { Task, SubTask } from '../../types';
import { storage } from '../../utils/storage';

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [subtaskTitle, setSubtaskTitle] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const savedTasks = storage.getTasks();
    setTasks(savedTasks);
  };

  const createTask = () => {
    if (!taskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskTitle,
      completed: false,
      priority: taskPriority,
      dueDate: taskDueDate ? new Date(taskDueDate) : undefined,
      subtasks: [],
      createdAt: new Date()
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    
    // Reset form
    setTaskTitle('');
    setTaskPriority('medium');
    setTaskDueDate('');
    setIsCreating(false);
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const completed = !task.completed;
        // Complete all subtasks when main task is completed
        const updatedSubtasks = completed 
          ? task.subtasks.map(subtask => ({ ...subtask, completed: true }))
          : task.subtasks;
        return { ...task, completed, subtasks: updatedSubtasks };
      }
      return task;
    });

    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map(subtask =>
          subtask.id === subtaskId 
            ? { ...subtask, completed: !subtask.completed }
            : subtask
        );
        
        // Check if main task should be completed (all subtasks done)
        const allSubtasksCompleted = updatedSubtasks.length > 0 && 
          updatedSubtasks.every(subtask => subtask.completed);
        
        return { 
          ...task, 
          subtasks: updatedSubtasks,
          completed: allSubtasksCompleted
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
  };

  const addSubtask = (taskId: string) => {
    if (!subtaskTitle.trim()) return;

    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newSubtask: SubTask = {
          id: Date.now().toString(),
          title: subtaskTitle,
          completed: false
        };
        return { ...task, subtasks: [...task.subtasks, newSubtask] };
      }
      return task;
    });

    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    setSubtaskTitle('');
  };

  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Status filter
    switch (filterBy) {
      case 'today':
        return task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();
      case 'upcoming':
        return task.dueDate && new Date(task.dueDate) > new Date() && !task.completed;
      case 'completed':
        return task.completed;
      default:
        return true;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed).length
  };

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{taskStats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Tasks</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{taskStats.pending}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Pending</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{taskStats.overdue}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Overdue</div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="max-w-md"
          />
          
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Tasks</option>
            <option value="today">Due Today</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <Button
          icon={Plus}
          onClick={() => setIsCreating(true)}
        >
          Add Task
        </Button>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Card className="text-center py-12">
          <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-2">
            {searchTerm || filterBy !== 'all' ? 'No matching tasks' : 'No tasks yet'}
          </h3>
          <p className="font-inter text-gray-600 dark:text-gray-300 mb-6">
            {searchTerm || filterBy !== 'all' 
              ? 'Try adjusting your search or filter'
              : 'Create your first task to get started'
            }
          </p>
          {!searchTerm && filterBy === 'all' && (
            <Button onClick={() => setIsCreating(true)}>
              Create Your First Task
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} hover>
              <div className="flex items-start space-x-4">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-1 text-primary-500 hover:text-primary-600"
                >
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className={`font-inter font-medium ${
                      task.completed 
                        ? 'line-through text-gray-500 dark:text-gray-400'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {task.title}
                    </h3>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-inter ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        icon={Trash2}
                        onClick={() => deleteTask(task.id)}
                      />
                    </div>
                  </div>

                  {task.dueDate && (
                    <div className={`flex items-center space-x-1 text-sm mt-2 ${
                      new Date(task.dueDate) < new Date() && !task.completed
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      <Calendar className="w-4 h-4" />
                      <span>Due {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                    </div>
                  )}

                  {/* Subtasks */}
                  {task.subtasks.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                      {task.subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-center space-x-2 mb-2">
                          <button
                            onClick={() => toggleSubtask(task.id, subtask.id)}
                            className="text-primary-500 hover:text-primary-600"
                          >
                            {subtask.completed ? (
                              <CheckSquare className="w-4 h-4" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                          <span className={`font-inter text-sm ${
                            subtask.completed 
                              ? 'line-through text-gray-500 dark:text-gray-400'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Subtask */}
                  <div className="mt-3 flex items-center space-x-2">
                    <Input
                      placeholder="Add a subtask..."
                      value={subtaskTitle}
                      onChange={setSubtaskTitle}
                      className="flex-1 text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={() => addSubtask(task.id)}
                      disabled={!subtaskTitle.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreating}
        onClose={() => {
          setIsCreating(false);
          setTaskTitle('');
          setTaskPriority('medium');
          setTaskDueDate('');
        }}
        title="Create New Task"
      >
        <div className="space-y-4">
          <Input
            label="Task Title"
            value={taskTitle}
            onChange={setTaskTitle}
            placeholder="Enter task title"
            required
          />

          <div>
            <label className="block font-inter font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value as any)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <Input
            label="Due Date (optional)"
            type="date"
            value={taskDueDate}
            onChange={setTaskDueDate}
          />

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCreating(false);
                setTaskTitle('');
                setTaskPriority('medium');
                setTaskDueDate('');
              }} 
              fullWidth
            >
              Cancel
            </Button>
            <Button onClick={createTask} fullWidth>
              Create Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;