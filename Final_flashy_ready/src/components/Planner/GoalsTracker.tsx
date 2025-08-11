import React, { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp, Calendar, CheckCircle, Circle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';
import { Goal, Milestone } from '../../types';
import { storage } from '../../utils/storage';

const GoalsTracker: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // Form states
  const [goalName, setGoalName] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [milestoneName, setMilestoneName] = useState('');
  const [milestoneDate, setMilestoneDate] = useState('');

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const savedGoals = storage.getGoals();
    setGoals(savedGoals);
  };

  const createGoal = () => {
    if (!goalName.trim() || !targetDate) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      name: goalName,
      description: goalDescription,
      targetDate: new Date(targetDate),
      milestones: [],
      progress: 0,
      createdAt: new Date()
    };

    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    storage.saveGoals(updatedGoals);
    
    // Reset form
    setGoalName('');
    setGoalDescription('');
    setTargetDate('');
    setIsCreating(false);
  };

  const updateGoalProgress = (goalId: string) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const completedMilestones = goal.milestones.filter(m => m.completed).length;
        const progress = goal.milestones.length > 0 
          ? Math.round((completedMilestones / goal.milestones.length) * 100)
          : 0;
        return { ...goal, progress };
      }
      return goal;
    });

    setGoals(updatedGoals);
    storage.saveGoals(updatedGoals);
  };

  const addMilestone = (goalId: string) => {
    if (!milestoneName.trim() || !milestoneDate) return;

    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newMilestone: Milestone = {
          id: Date.now().toString(),
          name: milestoneName,
          completed: false,
          dueDate: new Date(milestoneDate)
        };
        return { ...goal, milestones: [...goal.milestones, newMilestone] };
      }
      return goal;
    });

    setGoals(updatedGoals);
    storage.saveGoals(updatedGoals);
    updateGoalProgress(goalId);
    setMilestoneName('');
    setMilestoneDate('');
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(milestone =>
          milestone.id === milestoneId 
            ? { ...milestone, completed: !milestone.completed }
            : milestone
        );
        return { ...goal, milestones: updatedMilestones };
      }
      return goal;
    });

    setGoals(updatedGoals);
    storage.saveGoals(updatedGoals);
    updateGoalProgress(goalId);
  };

  const deleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    storage.saveGoals(updatedGoals);
  };

  const getDaysUntilTarget = (targetDate: Date) => {
    return differenceInDays(targetDate, new Date());
  };

  const goalStats = {
    total: goals.length,
    completed: goals.filter(g => g.progress === 100).length,
    inProgress: goals.filter(g => g.progress > 0 && g.progress < 100).length,
    notStarted: goals.filter(g => g.progress === 0).length
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{goalStats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Goals</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{goalStats.completed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{goalStats.inProgress}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">In Progress</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{goalStats.notStarted}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Not Started</div>
          </div>
        </Card>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-poppins font-semibold text-xl text-gray-900 dark:text-white mb-2">
            Goals & Progress
          </h2>
          <p className="font-inter text-gray-600 dark:text-gray-300">
            Track your long-term objectives and milestones
          </p>
        </div>
        <Button
          icon={Plus}
          onClick={() => setIsCreating(true)}
        >
          New Goal
        </Button>
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <Card className="text-center py-12">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-2">
            No goals yet
          </h3>
          <p className="font-inter text-gray-600 dark:text-gray-300 mb-6">
            Create your first goal to start tracking your progress
          </p>
          <Button onClick={() => setIsCreating(true)}>
            Create Your First Goal
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const daysUntilTarget = getDaysUntilTarget(new Date(goal.targetDate));
            const isOverdue = daysUntilTarget < 0 && goal.progress < 100;
            
            return (
              <Card key={goal.id} hover onClick={() => setSelectedGoal(goal)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-2">
                      {goal.name}
                    </h3>
                    <p className="font-inter text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {goal.description}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    goal.progress === 100 ? 'bg-green-500' : 'bg-primary-500'
                  }`}>
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-inter text-sm text-gray-600 dark:text-gray-300">Progress</span>
                    <span className="font-inter text-sm font-medium">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        goal.progress === 100 ? 'bg-green-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Target Date */}
                <div className={`flex items-center space-x-1 text-sm mb-3 ${
                  isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'
                }`}>
                  <Calendar className="w-4 h-4" />
                  <span>
                    Target: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
                    {daysUntilTarget > 0 && ` (${daysUntilTarget} days left)`}
                    {daysUntilTarget === 0 && ' (Due today)'}
                    {isOverdue && ` (${Math.abs(daysUntilTarget)} days overdue)`}
                  </span>
                </div>

                {/* Milestones Summary */}
                <div className="flex items-center justify-between">
                  <span className="font-inter text-sm text-gray-600 dark:text-gray-300">
                    {goal.milestones.filter(m => m.completed).length} / {goal.milestones.length} milestones
                  </span>
                  <div className="flex items-center space-x-1">
                    {goal.progress === 100 ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingUp className="w-5 h-5 text-primary-500" />
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Goal Modal */}
      <Modal
        isOpen={isCreating}
        onClose={() => {
          setIsCreating(false);
          setGoalName('');
          setGoalDescription('');
          setTargetDate('');
        }}
        title="Create New Goal"
      >
        <div className="space-y-4">
          <Input
            label="Goal Name"
            value={goalName}
            onChange={setGoalName}
            placeholder="Enter your goal"
            required
          />
          
          <Input
            label="Description"
            value={goalDescription}
            onChange={setGoalDescription}
            placeholder="Describe your goal in detail..."
            rows={3}
          />

          <Input
            label="Target Date"
            type="date"
            value={targetDate}
            onChange={setTargetDate}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCreating(false);
                setGoalName('');
                setGoalDescription('');
                setTargetDate('');
              }} 
              fullWidth
            >
              Cancel
            </Button>
            <Button onClick={createGoal} fullWidth>
              Create Goal
            </Button>
          </div>
        </div>
      </Modal>

      {/* Goal Details Modal */}
      <Modal
        isOpen={!!selectedGoal}
        onClose={() => setSelectedGoal(null)}
        title={selectedGoal?.name || ''}
        size="lg"
      >
        {selectedGoal && (
          <div className="space-y-6">
            {/* Goal Info */}
            <div>
              <p className="font-inter text-gray-600 dark:text-gray-300 mb-4">
                {selectedGoal.description}
              </p>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Target: {format(new Date(selectedGoal.targetDate), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Progress: {selectedGoal.progress}%</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    selectedGoal.progress === 100 ? 'bg-green-500' : 'bg-primary-500'
                  }`}
                  style={{ width: `${selectedGoal.progress}%` }}
                />
              </div>
            </div>

            {/* Add Milestone */}
            <div>
              <h4 className="font-poppins font-semibold text-lg mb-4">Add Milestone</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Milestone name"
                  value={milestoneName}
                  onChange={setMilestoneName}
                  className="flex-1"
                />
                <Input
                  type="date"
                  value={milestoneDate}
                  onChange={setMilestoneDate}
                />
                <Button
                  onClick={() => addMilestone(selectedGoal.id)}
                  disabled={!milestoneName.trim() || !milestoneDate}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Milestones List */}
            <div>
              <h4 className="font-poppins font-semibold text-lg mb-4">
                Milestones ({selectedGoal.milestones.length})
              </h4>
              {selectedGoal.milestones.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 font-inter text-center py-4">
                  No milestones yet. Add some milestones to track your progress.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedGoal.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleMilestone(selectedGoal.id, milestone.id)}
                          className="text-primary-500 hover:text-primary-600"
                        >
                          {milestone.completed ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                        <div>
                          <h5 className={`font-inter font-medium ${
                            milestone.completed 
                              ? 'line-through text-gray-500 dark:text-gray-400'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {milestone.name}
                          </h5>
                          <p className="font-inter text-xs text-gray-600 dark:text-gray-300">
                            Due: {format(new Date(milestone.dueDate), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => deleteGoal(selectedGoal.id)} fullWidth>
                Delete Goal
              </Button>
              <Button onClick={() => setSelectedGoal(null)} fullWidth>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GoalsTracker;