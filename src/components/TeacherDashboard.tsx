import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  Search,
  Eye,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';

interface TeacherDashboardProps {
  user: any;
  onLogout: () => void;
  onHome: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, onLogout, onHome }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    // Load students from localStorage
    const loadStudents = () => {
      const studentsData = JSON.parse(localStorage.getItem('students') || '[]');
      setStudents(studentsData);
    };

    loadStudents();

    // Set up interval to refresh student data every 5 seconds for real-time updates
    const interval = setInterval(loadStudents, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvatarEmoji = (avatarId: string) => {
    const avatars: Record<string, string> = {
      'boy1': '👦', 'girl1': '👧', 'boy2': '🧒', 'girl2': '👩',
      'man1': '👨', 'woman1': '👩‍🦱', 'student1': '👨‍🎓', 'student2': '👩‍🎓',
      'scientist1': '👨‍🔬', 'scientist2': '👩‍🔬', 'teacher1': '👨‍🏫', 'teacher2': '👩‍🏫'
    };
    return avatars[avatarId] || '👤';
  };

  const calculateOverallProgress = (student: any) => {
    if (!student.progress || !student.progress.subjects) return 0;
    const subjects = Object.values(student.progress.subjects) as any[];
    const total = subjects.reduce((sum, subject) => sum + subject.progress, 0);
    return Math.round(total / subjects.length);
  };

  const getTotalStats = () => {
    const totalStudents = students.length;
    const totalVideosWatched = students.reduce((sum, student) => 
      sum + (student.progress?.videosWatched || 0), 0);
    const totalGamesPlayed = students.reduce((sum, student) => 
      sum + (student.progress?.gamesPlayed || 0), 0);
    const averageProgress = students.length > 0 
      ? Math.round(students.reduce((sum, student) => 
          sum + calculateOverallProgress(student), 0) / students.length)
      : 0;

    return { totalStudents, totalVideosWatched, totalGamesPlayed, averageProgress };
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'content', label: 'Content', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  const renderOverview = () => {
    const stats = getTotalStats();
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Students</p>
                <p className="text-3xl font-bold">{stats.totalStudents}</p>
              </div>
              <Users className="w-12 h-12 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Average Progress</p>
                <p className="text-3xl font-bold">{stats.averageProgress}%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Videos Watched</p>
                <p className="text-3xl font-bold">{stats.totalVideosWatched}</p>
              </div>
              <BookOpen className="w-12 h-12 text-purple-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Games Played</p>
                <p className="text-3xl font-bold">{stats.totalGamesPlayed}</p>
              </div>
              <Award className="w-12 h-12 text-orange-200" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Recent Student Activity</h3>
            <div className="space-y-3">
              {students.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-lg">
                    {getAvatarEmoji(student.avatar)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-600">
                      {student.progress?.videosWatched || 0} videos • {student.progress?.gamesPlayed || 0} games
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      {calculateOverallProgress(student)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Subject Performance</h3>
            <div className="space-y-4">
              {['science', 'mathematics', 'technology', 'engineering'].map((subject) => {
                const avgProgress = students.length > 0 
                  ? Math.round(students.reduce((sum, student) => 
                      sum + (student.progress?.subjects?.[subject]?.progress || 0), 0) / students.length)
                  : 0;
                
                return (
                  <div key={subject}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{subject}</span>
                      <span className="text-sm text-gray-600">{avgProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          subject === 'science' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          subject === 'mathematics' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                          subject === 'technology' ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                          'bg-gradient-to-r from-orange-400 to-orange-600'
                        }`}
                        style={{ width: `${avgProgress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  XP
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-lg mr-3">
                        {getAvatarEmoji(student.avatar)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">@{student.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${calculateOverallProgress(student)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {calculateOverallProgress(student)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.progress?.totalXP || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.progress?.videosWatched || 0}V • {student.progress?.gamesPlayed || 0}G
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'Students will appear here when they register.'}
          </p>
        </div>
      )}
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Content Library</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-4xl mb-3">🌱</div>
            <h4 className="font-semibold mb-2">How Plants Make Food</h4>
            <p className="text-sm text-gray-600 mb-3">Science • 5:30 • Easy</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>👁️ 456 views</span>
              <span>⭐ 4.8/5</span>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-4xl mb-3">📐</div>
            <h4 className="font-semibold mb-2">Fun with Shapes</h4>
            <p className="text-sm text-gray-600 mb-3">Mathematics • 7:15 • Medium</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>👁️ 387 views</span>
              <span>⭐ 4.6/5</span>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-4xl mb-3">🧮</div>
            <h4 className="font-semibold mb-2">Math Quiz Challenge</h4>
            <p className="text-sm text-gray-600 mb-3">Game • Interactive • Easy</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>🎮 423 plays</span>
              <span>⭐ 4.9/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">Engagement Metrics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">2.4h</div>
              <div className="text-sm text-blue-800">Avg Session</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">94%</div>
              <div className="text-sm text-green-800">Completion</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">67%</div>
              <div className="text-sm text-purple-800">Return Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">Popular Content</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span className="font-medium">How Plants Make Food</span>
              </div>
              <span className="text-sm text-gray-600">456 views</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span className="font-medium">Math Quiz Challenge</span>
              </div>
              <span className="text-sm text-gray-600">423 plays</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-orange-400 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span className="font-medium">Fun with Shapes</span>
              </div>
              <span className="text-sm text-gray-600">387 views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent_Main = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'students': return renderStudents();
      case 'content': return renderContent();
      case 'analytics': return renderAnalytics();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
              👨‍🏫
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.subject} Teacher</p>
            </div>
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
            {menuItems.find(item => item.id === activeSection)?.label || 'Overview'}
          </h1>
          <p className="text-gray-600">Welcome back, {user.name}! Here's what's happening with your students.</p>
        </div>

        {renderContent_Main()}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                    {getAvatarEmoji(selectedStudent.avatar)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                    <p className="text-white/80">@{selectedStudent.username} • Grade {selectedStudent.grade}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Progress Overview</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Overall Progress</span>
                      <span className="font-bold text-indigo-600">{calculateOverallProgress(selectedStudent)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total XP</span>
                      <span className="font-bold text-green-600">{selectedStudent.progress?.totalXP || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Current Level</span>
                      <span className="font-bold text-purple-600">{Math.floor((selectedStudent.progress?.totalXP || 0) / 100) + 1}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Activity Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Videos Watched</span>
                      <span className="font-bold text-blue-600">{selectedStudent.progress?.videosWatched || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Games Played</span>
                      <span className="font-bold text-orange-600">{selectedStudent.progress?.gamesPlayed || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Time Spent</span>
                      <span className="font-bold text-gray-600">{selectedStudent.progress?.timeSpent || 0}m</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Subject Progress</h3>
                <div className="space-y-3">
                  {Object.entries(selectedStudent.progress?.subjects || {}).map(([subject, data]: [string, any]) => (
                    <div key={subject}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium capitalize">{subject}</span>
                        <span className="text-sm font-bold">{data.progress}% ({data.xp} XP)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;