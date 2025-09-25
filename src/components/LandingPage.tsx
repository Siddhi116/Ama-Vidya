import React, { useState } from 'react';
import { Rocket, Globe, Users, GraduationCap } from 'lucide-react';

interface LandingPageProps {
  onRoleSelect: (role: 'student' | 'teacher') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onRoleSelect }) => {
  const [language, setLanguage] = useState('en');

  const translations = {
    en: {
      welcome: "Welcome to Interactive STEM Learning",
      tagline: "Explore, Learn, and Discover the Wonders of Science, Technology, Engineering, and Mathematics",
      student: "Student",
      teacher: "Teacher",
      studentDesc: "Start your learning journey with fun games and videos",
      teacherDesc: "Manage content and track student progress"
    },
    od: {
      welcome: "ଇଣ୍ଟରାକ୍ଟିଭ୍ STEM ଶିକ୍ଷାକୁ ସ୍ୱାଗତ",
      tagline: "ବିଜ୍ଞାନ, ପ୍ରଯୁକ୍ତିବିଦ୍ୟା, ଇଞ୍ଜିନିୟରିଂ ଏବଂ ଗଣିତର ଆଶ୍ଚର୍ଯ୍ୟ ଅନ୍ୱେଷଣ, ଶିକ୍ଷା ଏବଂ ଆବିଷ୍କାର କରନ୍ତୁ",
      student: "ଛାତ୍ର",
      teacher: "ଶିକ୍ଷକ",
      studentDesc: "ମଜାଦାର ଖେଳ ଏବଂ ଭିଡିଓ ସହିତ ଆପଣଙ୍କର ଶିକ୍ଷା ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ",
      teacherDesc: "ବିଷୟବସ୍ତୁ ପରିଚାଳନା କରନ୍ତୁ ଏବଂ ଛାତ୍ରଙ୍କ ଅଗ୍ରଗତି ଟ୍ରାକ୍ କରନ୍ତୁ"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-32 h-32 bg-white/5 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full animate-bounce delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center gap-3">
          <Rocket className="w-10 h-10 text-white animate-pulse" />
          <h1 className="text-3xl font-bold text-white">AmaVidya</h1>
        </div>
        <div className="flex items-center gap-4">
          <Globe className="w-5 h-5 text-white" />
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <option value="en" className="text-gray-800">English</option>
            <option value="od" className="text-gray-800">ଓଡ଼ିଆ</option>
          </select>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            {t.welcome}
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 animate-fade-in-delay">
            {t.tagline}
          </p>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            {/* Student Card */}
            <div 
              onClick={() => onRoleSelect('student')}
              className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 w-full max-w-sm cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-2xl animate-slide-up"
            >
              <div className="text-6xl mb-6 group-hover:animate-bounce">
                <GraduationCap className="w-16 h-16 text-white mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.student}</h3>
              <p className="text-white/80 text-lg leading-relaxed">{t.studentDesc}</p>
              <div className="mt-6 bg-white/20 rounded-full px-6 py-2 text-white font-semibold group-hover:bg-white/30 transition-colors">
                Get Started →
              </div>
            </div>

            {/* Teacher Card */}
            <div 
              onClick={() => onRoleSelect('teacher')}
              className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 w-full max-w-sm cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-2xl animate-slide-up-delay"
            >
              <div className="text-6xl mb-6 group-hover:animate-bounce">
                <Users className="w-16 h-16 text-white mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.teacher}</h3>
              <p className="text-white/80 text-lg leading-relaxed">{t.teacherDesc}</p>
              <div className="mt-6 bg-white/20 rounded-full px-6 py-2 text-white font-semibold group-hover:bg-white/30 transition-colors">
                Get Started →
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6">
        <p className="text-white/60">© 2024 AmaVidya. Empowering minds through interactive learning.</p>
      </footer>
    </div>
  );
};

export default LandingPage;