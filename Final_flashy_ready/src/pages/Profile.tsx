import React, { useState, useEffect } from 'react';
import { User, Trophy, Download, Upload, Settings, Trash2, Star } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';
import { UserProfile, Badge } from '../types';
import { storage } from '../utils/storage';
import { createDemoProfile } from '../utils/demo-data';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [userName, setUserName] = useState('');

  // Avatar options
  const avatarOptions = [
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/2709388/pexels-photo-2709388.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=100'
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    let userProfile = storage.getProfile();
    if (!userProfile) {
      userProfile = createDemoProfile();
      storage.saveProfile(userProfile);
    }
    setProfile(userProfile);
  };

  const updateProfile = () => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      name: userName || profile.name
    };

    setProfile(updatedProfile);
    storage.saveProfile(updatedProfile);
    setIsEditingProfile(false);
  };

  const updateAvatar = (avatarUrl: string) => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      avatar: avatarUrl
    };

    setProfile(updatedProfile);
    storage.saveProfile(updatedProfile);
  };

  const toggleNotifications = () => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      notifications: !profile.notifications
    };

    setProfile(updatedProfile);
    storage.saveProfile(updatedProfile);
  };

  const exportData = () => {
    const data = storage.exportAllData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `studysync-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const success = storage.importAllData(data);
        if (success) {
          alert('Data imported successfully! Please refresh the page.');
        } else {
          alert('Error importing data. Please check the file format.');
        }
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const clearAllData = () => {
    storage.clearAllData();
    setIsConfirmingDelete(false);
    alert('All data has been cleared. The page will refresh.');
    window.location.reload();
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-poppins font-bold text-3xl text-gray-900 dark:text-white mb-4">
          Profile
        </h1>
        <p className="font-inter text-gray-600 dark:text-gray-300 text-lg">
          Manage your account, view stats, and customize your experience
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="text-center">
              <img
                src={profile.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="font-poppins font-semibold text-xl text-gray-900 dark:text-white mb-2">
                {profile.name || 'Anonymous User'}
              </h2>
              <p className="font-inter text-gray-600 dark:text-gray-300 mb-4">
                StudySync Member
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setUserName(profile.name || '');
                  setIsEditingProfile(true);
                }}
              >
                Edit Profile
              </Button>
            </div>
          </Card>

          {/* Avatar Selection */}
          <Card>
            <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-4">
              Choose Avatar
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {avatarOptions.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => updateAvatar(avatar)}
                  className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    profile.avatar === avatar
                      ? 'border-primary-500 ring-2 ring-primary-200'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                  }`}
                >
                  <img
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Study Stats */}
          <Card>
            <h3 className="font-poppins font-semibold text-xl text-gray-900 dark:text-white mb-6">
              Study Statistics
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg text-white">
                  <div>
                    <p className="font-inter text-sm opacity-90">Total Study Time</p>
                    <p className="font-poppins font-bold text-2xl">
                      {formatTime(profile.studyStats.totalStudyTime)}
                    </p>
                  </div>
                  <div className="text-3xl opacity-80">📚</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white">
                  <div>
                    <p className="font-inter text-sm opacity-90">Current Streak</p>
                    <p className="font-poppins font-bold text-2xl">
                      {profile.studyStats.streak} days
                    </p>
                  </div>
                  <div className="text-3xl opacity-80">🔥</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-inter text-gray-700 dark:text-gray-300">Flashcards Reviewed</span>
                  <span className="font-inter font-semibold text-primary-600 dark:text-primary-400">
                    {profile.studyStats.flashcardsReviewed}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-inter text-gray-700 dark:text-gray-300">Quizzes Taken</span>
                  <span className="font-inter font-semibold text-secondary-600 dark:text-secondary-400">
                    {profile.studyStats.quizzesTaken}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-inter text-gray-700 dark:text-gray-300">Notes Created</span>
                  <span className="font-inter font-semibold text-accent-600 dark:text-accent-400">
                    {profile.studyStats.notesCreated}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-inter text-gray-700 dark:text-gray-300">Goals Completed</span>
                  <span className="font-inter font-semibold text-blue-600 dark:text-blue-400">
                    {profile.studyStats.goalsCompleted}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Badges */}
          <Card>
            <h3 className="font-poppins font-semibold text-xl text-gray-900 dark:text-white mb-6">
              Achievements
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {profile.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-lg border-2 ${
                    badge.earned
                      ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900 dark:border-yellow-600'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex-1">
                      <h4 className={`font-inter font-semibold ${
                        badge.earned ? 'text-yellow-800 dark:text-yellow-200' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {badge.name}
                      </h4>
                      <p className={`font-inter text-sm ${
                        badge.earned ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-500 dark:text-gray-500'
                      }`}>
                        {badge.description}
                      </p>
                      {badge.earned && badge.earnedAt && (
                        <p className="font-inter text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                          Earned {new Date(badge.earnedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {badge.earned && <Star className="w-5 h-5 text-yellow-500" />}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Settings */}
          <Card>
            <h3 className="font-poppins font-semibold text-xl text-gray-900 dark:text-white mb-6">
              Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-inter font-medium text-gray-900 dark:text-white">
                    Notifications
                  </h4>
                  <p className="font-inter text-sm text-gray-600 dark:text-gray-300">
                    Receive study reminders and achievement notifications
                  </p>
                </div>
                <Button
                  variant={profile.notifications ? 'primary' : 'outline'}
                  onClick={toggleNotifications}
                >
                  {profile.notifications ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Data Management */}
          <Card>
            <h3 className="font-poppins font-semibold text-xl text-gray-900 dark:text-white mb-6">
              Data Management
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  icon={Download}
                  onClick={exportData}
                  className="flex-1"
                >
                  Export Data
                </Button>
                
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                  id="import-data"
                />
                <Button
                  variant="outline"
                  icon={Upload}
                  onClick={() => document.getElementById('import-data')?.click()}
                  className="flex-1"
                >
                  Import Data
                </Button>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <Button
                  variant="outline"
                  icon={Trash2}
                  onClick={() => setIsConfirmingDelete(true)}
                  className="w-full text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900"
                >
                  Clear All Data
                </Button>
                <p className="font-inter text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  This will permanently delete all your study data, notes, and progress
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditingProfile}
        onClose={() => setIsEditingProfile(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <Input
            label="Display Name"
            value={userName}
            onChange={setUserName}
            placeholder="Enter your name"
          />

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsEditingProfile(false)} 
              fullWidth
            >
              Cancel
            </Button>
            <Button onClick={updateProfile} fullWidth>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
        title="Clear All Data"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Trash2 className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <p className="font-inter text-gray-900 dark:text-white mb-2">
                Are you sure you want to clear all your data?
              </p>
              <p className="font-inter text-sm text-gray-600 dark:text-gray-300">
                This will permanently delete:
              </p>
              <ul className="font-inter text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                <li>• All flashcard decks and cards</li>
                <li>• All notes and autosaves</li>
                <li>• Calendar events and tasks</li>
                <li>• Goals and progress tracking</li>
                <li>• Mood entries and study stats</li>
                <li>• Profile settings and achievements</li>
              </ul>
              <p className="font-inter text-sm text-red-600 dark:text-red-400 mt-3 font-medium">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsConfirmingDelete(false)} 
              fullWidth
            >
              Cancel
            </Button>
            <Button 
              onClick={clearAllData} 
              fullWidth
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Clear All Data
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;