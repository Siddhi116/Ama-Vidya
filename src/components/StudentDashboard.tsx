import React, { useState, useEffect } from 'react';
import { Home, Play, TowerControl as GameController2, TrendingUp, Trophy, Star, Clock, Target, Settings, LogOut, User } from 'lucide-react';
import AvatarCustomization from './AvatarCustomization';

interface StudentDashboardProps {
  user: any;
  onLogout: () => void;
  onHome: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout, onHome }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [userData, setUserData] = useState(user);
  const [progress, setProgress] = useState(user.progress || {
    totalXP: 0,
    currentLevel: 1,
    videosWatched: 0,
    gamesPlayed: 0,
    timeSpent: 0,
    currentStreak: 0,
    subjects: {
      science: { progress: 0, xp: 0 },
      mathematics: { progress: 0, xp: 0 },
      technology: { progress: 0, xp: 0 },
      engineering: { progress: 0, xp: 0 }
    }
  });

  useEffect(() => {
    // Load user data from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.id === user.id) {
      setUserData(currentUser);
      setProgress(currentUser.progress || progress);
    }
  }, []);

  const updateProgress = (newProgress: any) => {
    const updatedProgress = { ...progress, ...newProgress };
    setProgress(updatedProgress);
    
    // Update user data
    const updatedUser = { ...userData, progress: updatedProgress };
    setUserData(updatedUser);
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update students array
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const updatedStudents = students.map((s: any) => 
      s.id === userData.id ? updatedUser : s
    );
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  const handleAvatarSave = (avatarId: string) => {
    const updatedUser = { ...userData, avatar: avatarId };
    setUserData(updatedUser);
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update students array
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const updatedStudents = students.map((s: any) => 
      s.id === userData.id ? updatedUser : s
    );
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  const playVideo = (videoId: string, subject: string) => {
    const newProgress = {
      videosWatched: progress.videosWatched + 1,
      totalXP: progress.totalXP + 10,
      subjects: {
        ...progress.subjects,
        [subject]: {
          progress: Math.min(100, progress.subjects[subject].progress + 5),
          xp: progress.subjects[subject].xp + 10
        }
      }
    };
    updateProgress(newProgress);
  };

  const playGame = (gameId: string, subject: string) => {
    const newProgress = {
      gamesPlayed: progress.gamesPlayed + 1,
      totalXP: progress.totalXP + 20,
      subjects: {
        ...progress.subjects,
        [subject]: {
          progress: Math.min(100, progress.subjects[subject].progress + 10),
          xp: progress.subjects[subject].xp + 20
        }
      }
    };
    updateProgress(newProgress);
  };

  const getAvatarEmoji = (avatarId: string) => {
    const avatars: Record<string, string> = {
      'boy1': '👦', 'girl1': '👧', 'boy2': '🧒', 'girl2': '👩',
      'man1': '👨', 'woman1': '👩‍🦱', 'student1': '👨‍🎓', 'student2': '👩‍🎓',
      'scientist1': '👨‍🔬', 'scientist2': '👩‍🔬', 'teacher1': '👨‍🏫', 'teacher2': '👩‍🏫'
    };
    return avatars[avatarId] || '👤';
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'videos', label: 'STEM Videos', icon: Play },
    { id: 'games', label: 'Learning Games', icon: GameController2 },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
  ];

  const videos = [
    { id: 'photosynthesis', title: 'How Plants Make Food', subject: 'science', duration: '5:30', difficulty: 'Easy', icon: '🌱' },
    { id: 'geometry', title: 'Fun with Shapes', subject: 'mathematics', duration: '7:15', difficulty: 'Medium', icon: '📐' },
    { id: 'circuits', title: 'Electric Circuits', subject: 'technology', duration: '6:45', difficulty: 'Medium', icon: '⚡' },
    { id: 'bridges', title: 'Building Bridges', subject: 'engineering', duration: '8:20', difficulty: 'Hard', icon: '🌉' },
  ];

  const games = [
    { id: 'math-quiz', title: 'Math Quiz Challenge', subject: 'mathematics', difficulty: 'Easy', icon: '🧮' },
    { id: 'science-lab', title: 'Virtual Science Lab', subject: 'science', difficulty: 'Medium', icon: '🧪' },
    { id: 'pattern-game', title: 'Pattern Master', subject: 'mathematics', difficulty: 'Hard', icon: '🎨' },
    { id: 'coding-game', title: 'Code Builder', subject: 'technology', difficulty: 'Medium', icon: '💻' },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total XP</p>
              <p className="text-3xl font-bold">{progress.totalXP}</p>
            </div>
            <Star className="w-12 h-12 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Level</p>
              <p className="text-3xl font-bold">{Math.floor(progress.totalXP / 100) + 1}</p>
            </div>
            <Trophy className="w-12 h-12 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Videos Watched</p>
              <p className="text-3xl font-bold">{progress.videosWatched}</p>
            </div>
            <Play className="w-12 h-12 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Games Played</p>
              <p className="text-3xl font-bold">{progress.gamesPlayed}</p>
            </div>
            <GameController2 className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">Subject Progress</h3>
          <div className="space-y-4">
            {Object.entries(progress.subjects).map(([subject, data]) => (
              <div key={subject}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium capitalize">{subject}</span>
                  <span className="text-sm text-gray-600">{data.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${data.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Play className="w-5 h-5 text-blue-600" />
              <span className="text-sm">Watched "How Plants Make Food"</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <GameController2 className="w-5 h-5 text-green-600" />
              <span className="text-sm">Completed Math Quiz Challenge</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Trophy className="w-5 h-5 text-purple-600" />
              <span className="text-sm">Earned "Video Watcher" achievement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVideos = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-48 flex items-center justify-center text-6xl text-white">
              {video.icon}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{video.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {video.duration}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  video.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  video.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {video.difficulty}
                </span>
              </div>
              <button
                onClick={() => playVideo(video.id, video.subject)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              >
                Watch Video (+10 XP)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGames = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-6xl text-center mb-4">{game.icon}</div>
            <h3 className="text-xl font-bold text-center mb-2">{game.title}</h3>
            <div className="flex justify-center mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                game.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {game.difficulty}
              </span>
            </div>
            <button
              onClick={() => playGame(game.id, game.subject)}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200"
            >
              Play Game (+20 XP)
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold mb-6">Overall Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">Subject Breakdown</h4>
            <div className="space-y-4">
              {Object.entries(progress.subjects).map(([subject, data]) => (
                <div key={subject}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium capitalize">{subject}</span>
                    <span className="text-sm font-bold">{data.progress}% ({data.xp} XP)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        subject === 'science' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                        subject === 'mathematics' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                        subject === 'technology' ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                        'bg-gradient-to-r from-orange-400 to-orange-600'
                      }`}
                      style={{ width: `${data.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Statistics</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>Total XP Earned</span>
                <span className="font-bold text-indigo-600">{progress.totalXP}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>Current Level</span>
                <span className="font-bold text-green-600">{Math.floor(progress.totalXP / 100) + 1}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>Videos Watched</span>
                <span className="font-bold text-blue-600">{progress.videosWatched}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>Games Played</span>
                <span className="font-bold text-purple-600">{progress.gamesPlayed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl shadow-lg ${progress.videosWatched > 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' : 'bg-gray-100'}`}>
          <div className="text-4xl mb-3">🎬</div>
          <h3 className="text-lg font-bold mb-2">Video Watcher</h3>
          <p className="text-sm opacity-90">Watch your first STEM video</p>
          <div className="mt-3">
            {progress.videosWatched > 0 ? (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Earned!</span>
            ) : (
              <span className="text-xs bg-gray-300 px-2 py-1 rounded-full text-gray-600">Locked</span>
            )}
          </div>
        </div>

        <div className={`p-6 rounded-2xl shadow-lg ${progress.gamesPlayed > 0 ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' : 'bg-gray-100'}`}>
          <div className="text-4xl mb-3">🎮</div>
          <h3 className="text-lg font-bold mb-2">Game Starter</h3>
          <p className="text-sm opacity-90">Play your first learning game</p>
          <div className="mt-3">
            {progress.gamesPlayed > 0 ? (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Earned!</span>
            ) : (
              <span className="text-xs bg-gray-300 px-2 py-1 rounded-full text-gray-600">Locked</span>
            )}
          </div>
        </div>

        <div className={`p-6 rounded-2xl shadow-lg ${progress.totalXP >= 100 ? 'bg-gradient-to-br from-purple-400 to-purple-600 text-white' : 'bg-gray-100'}`}>
          <div className="text-4xl mb-3">⭐</div>
          <h3 className="text-lg font-bold mb-2">Rising Star</h3>
          <p className="text-sm opacity-90">Earn 100 XP</p>
          <div className="mt-3">
            {progress.totalXP >= 100 ? (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Earned!</span>
            ) : (
              <span className="text-xs bg-gray-300 px-2 py-1 rounded-full text-gray-600">{progress.totalXP}/100 XP</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'videos': return renderVideos();
      case 'games': return renderGames();
      case 'progress': return renderProgress();
      case 'achievements': return renderAchievements();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3 mb-4">
            <div 
              onClick={() => setShowAvatarModal(true)}
              className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-2xl cursor-pointer hover:scale-105 transition-transform"
            >
              {getAvatarEmoji(userData.avatar)}
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{userData.name}</h3>
              <p className="text-sm text-gray-600">Grade {userData.grade}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">{progress.totalXP} XP</span>
            <span className="text-gray-500">• Level {Math.floor(progress.totalXP / 100) + 1}</span>
          </div>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors mb-2 ${
                  activeSection === item.id
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <button
            onClick={onHome}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
          </h1>
          <p className="text-gray-600">Welcome back, {userData.name}! Ready to learn something new?</p>
        </div>

        {renderContent()}
      </div>

      {/* Avatar Customization Modal */}
      <AvatarCustomization
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        currentAvatar={userData.avatar}
        onSave={handleAvatarSave}
      />
    </div>
  );
};

export default StudentDashboard;